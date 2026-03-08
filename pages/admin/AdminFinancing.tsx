import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { FinancingRequest } from '../../types';

interface AdminFinancingProps {
  requests: FinancingRequest[];
  onUpdateStatus: (id: string, status: FinancingRequest['status']) => Promise<void>;
}

const AdminFinancing: React.FC<AdminFinancingProps> = ({ requests, onUpdateStatus }) => {
  const setStatus = async (id: string, status: FinancingRequest['status']) => {
    try {
      await onUpdateStatus(id, status);
    } catch (error) {
      console.error('Failed to update financing status', error);
      window.alert('Unable to update financing status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financing Applications</h1>
        <p className="text-gray-500 mt-1">Review and process customer financing requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Requests" value={requests.length} />
        <StatCard label="Pending" value={requests.filter((r) => r.status === 'pending').length} />
        <StatCard label="Approved" value={requests.filter((r) => r.status === 'approved').length} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Loan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No financing requests found.</td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{request.customerName}</p>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${request.loanAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{request.term} months</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          request.status === 'approved'
                            ? 'bg-green-50 text-green-600'
                            : request.status === 'rejected'
                              ? 'bg-red-50 text-red-600'
                              : request.status === 'reviewed'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {request.status === 'pending' && <Clock size={12} className="mr-1" />}
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStatus(request.id, 'reviewed')}
                          className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => setStatus(request.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Approve"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
  </div>
);

export default AdminFinancing;
