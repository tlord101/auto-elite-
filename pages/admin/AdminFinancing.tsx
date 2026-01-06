
import React, { useState } from 'react';
import { FinancingRequest } from '../../types';

const AdminFinancing: React.FC = () => {
  const [requests, setRequests] = useState<FinancingRequest[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Financing Applications</h1>
        <p className="text-slate-500 text-sm">Review and process customer loan and pre-approval requests</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loan Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length > 0 ? (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{r.customerName}</p>
                      <p className="text-xs text-slate-400">{r.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-indigo-600">${r.loanAmount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Down: ${r.downPayment.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{r.term} months</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        r.status === 'reviewed' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                        Review Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <div className="text-4xl">💰</div>
                      <h3 className="text-lg font-bold text-slate-900">No applications</h3>
                      <p className="text-slate-500 text-sm">Financing requests from the calculator page will appear here for processing.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancing;
