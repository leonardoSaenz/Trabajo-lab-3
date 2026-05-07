import React from 'react';

export const RecentDealsTable = ({ deals, onViewDeal }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'won': return 'status-won';
      case 'open': return 'status-open';
      case 'lost': return 'status-lost';
      default: return '';
    }
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <span className="card-title">Top Recent Deals</span>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Person</th>
              <th>Assigned To</th>
              <th>Deal Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td style={{ fontWeight: 500 }}>{deal.clientName}</td>
                <td>{deal.contactPerson}</td>
                <td>{deal.ownerName}</td>
                <td style={{ fontWeight: 600 }}>€{deal.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(deal.status)}`}>
                    {deal.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    onClick={() => onViewDeal(deal)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
