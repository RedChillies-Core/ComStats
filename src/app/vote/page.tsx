"use client"
import React, { useState } from "react"

const SocialVoting = () => {
  const [category, setCategory] = useState("Standard Entry")
  const [description, setDescription] = useState("")

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-semibold text-purple text-center">
        Coming Soon - Social Voting
      </h3>

      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-purple">Objectives</h2>
        <ul className="list-disc pl-6">
          <li>Promote community engagement</li>
          <li>Elevate project quality and innovation standards</li>
          <li>Ensure transparent and democratic project selection processes</li>
          <li>Enhance the intrinsic value and utility of COMAI tokens</li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-6 ">
        <h2 className="text-xl font-bold mb-4 text-purple">
          Social Voting Structure
        </h2>
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Entry Fee (COMAI)</th>
              <th className="border px-4 py-2">Reward (Staked COMAI)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Standard Entry</td>
              <td className="border px-4 py-2">50 | Seats: 10</td>
              <td className="border px-4 py-2">Top 3: 100k per project</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Existing Projects</td>
              <td className="border px-4 py-2">20 | Seats: 10</td>
              <td className="border px-4 py-2">Top 2: 50k per project</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Base Entry</td>
              <td className="border px-4 py-2">10 | Seats: 10</td>
              <td className="border px-4 py-2">Top 1: 10k per project</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-purple">
          Voting and Reward Timeline
        </h2>
        <p>
          The voting process will run for 5 days, starting on the 1st of each
          month. Following the voting period, rewards will be staked for 21
          days, starting on the 7th of the month, allowing ample time for
          evaluation and validation of winning projects by the community.
        </p>
        <p className="mt-4 text-purple">Voting Power Calculation:</p>
        <p>
          Voting Power = 0.8 * sqrt(total staked * length of stake) + 0.1 *
          sqrt(staked on comstats * length of stake) + 0.1 * sqrt(Free Balance
          $COMAI)
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-purple">
          Implementation Plan
        </h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Project Submission:</strong> Interested projects or modules
            will submit their entries within the specified categories along with
            the respective entry fees.
          </li>
          <li>
            <strong>Voting Process:</strong> A quadratic voting algorithm will
            be utilized to ensure equitable and weighted results based on
            stakers participation.
          </li>
          <li>
            <strong>Reward Distribution:</strong> Rewards will be staked for 21
            days, providing an opportunity for thorough assessment and
            validation of winning projects.
          </li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-6 ">
        <h2 className="text-xl font-bold mb-4 text-purple">Benefits</h2>
        <ul className="list-disc pl-6">
          <li>Enhanced community engagement</li>
          <li>Improved project quality</li>
          <li>Transparent governance mechanisms</li>
          <li>Anticipated value appreciation of COMAI tokens</li>
        </ul>
      </section>
    </div>
  )
}

export default SocialVoting
