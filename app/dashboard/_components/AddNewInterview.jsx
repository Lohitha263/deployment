'use client'

import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoaderCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from '@/utils/GeminiAIModal';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const AddNewInterview = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [questionCount, setQuestionCount] = useState(5);  // Default to 5 questions
  const [loading, setLoading] = useState(false);
  const [createdMockId, setCreatedMockId] = useState(null);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const count = questionCount > 0 ? questionCount : 5; // fallback to 5 if invalid

      const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on this information, please give us ${count} interview questions with answers in JSON format. Only include 'question' and 'answer' fields.`;

      const result = await chatSession.sendMessage(InputPrompt);
      const rawText = await result.response.text();

      let cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");

      const parsedJson = JSON.parse(jsonMatch[0]);

      // Insert into DB but do NOT redirect yet
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: JSON.stringify(parsedJson),
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
        createdAt: moment().format('DD/MM/YYYY')
      }).returning({ mockId: MockInterview.mockId });

      if (resp?.length) {
        setCreatedMockId(resp[0]?.mockId);
        setShowConfirm(true); // Show confirmation dialog
      } else {
        console.error("Failed to insert into database");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setOpenDialog(false);
    router.push('/dashboard/interview/' + createdMockId);
  };

  return (
    <div>
      {/* Trigger */}
      <button
        onClick={() => setOpenDialog(true)}
        className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Add new interview"
      >
        + Add New Interview
      </button>

      {/* Form Dialog */}
      <AlertDialog open={openDialog && !showConfirm}>
        <AlertDialogContent className='max-w-xl rounded-lg shadow-lg border border-gray-200 p-8 bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-2xl font-semibold text-gray-900 mb-4'>
              Share Details About Your Job Interview
            </AlertDialogTitle>
            <AlertDialogDescription>
              <form onSubmit={onSubmit} className="space-y-6">

                <div>
                  <label htmlFor="jobPosition" className="block text-sm font-medium text-gray-700">
                    Job Role / Position
                  </label>
                  <Input
                    id="jobPosition"
                    placeholder="Full Stack Developer"
                    className="mt-1"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="jobDesc" className="block text-sm font-medium text-gray-700">
                    Job Description / Tech Stack
                  </label>
                  <Textarea
                    id="jobDesc"
                    placeholder="React, Node.js, JavaScript, MongoDB, Next.js, etc."
                    className="mt-1"
                    rows={4}
                    required
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="jobExperience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <Input
                    id="jobExperience"
                    placeholder="5"
                    type="number"
                    min="0"
                    max="40"
                    className="mt-1"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700">
                    Number of Interview Questions
                  </label>
                  <Input
                    id="questionCount"
                    placeholder="5"
                    type="number"
                    min="1"
                    max="50"
                    className="mt-1"
                    required
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label htmlFor="resumeUpload" className="block text-sm font-medium text-gray-700">
                    Upload Resume (optional)
                  </label>
                  <input
                    id="resumeUpload"
                    type="file"
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100
                    "
                  />
                </div>

                <AlertDialogFooter className="flex justify-end gap-4 pt-4">
                  <AlertDialogCancel
                    type="button"
                    className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2 bg-indigo-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-indigo-700 transition ${loading ? "cursor-not-allowed opacity-70" : ""
                      }`}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className='animate-spin' size={18} /> Generating...
                      </>
                    ) : (
                      'Next'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>

              </form>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm}>
        <AlertDialogContent className='max-w-md rounded-lg shadow-lg border border-gray-200 p-8 bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-xl font-semibold text-gray-900 mb-4'>
              Questions Generated Successfully
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p className="text-gray-700 mb-6">
                Your interview questions have been generated. Would you like to start the interview now?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-4">
            <AlertDialogCancel
              type="button"
              className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              type="button"
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              onClick={handleConfirm}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AddNewInterview;
