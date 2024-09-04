import React from 'react';
import './pagingBar.css';

const PagingBar = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Eğer sayfa sayısı 1 veya daha az ise gizle

  return (
    <div className="paging-bar">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button 
          key={index} 
          onClick={() => onPageChange(index + 1)} 
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PagingBar;
