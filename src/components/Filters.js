import React from 'react';

const AVAILABLE_CATEGORIES = ['Work', 'Personal', 'Urgent'];

export default function Filter({ 
  searchKeyword, 
  setSearchKeyword, 
  createdRange, 
  setCreatedRange, 
  completedRange, 
  setCompletedRange,
  dueDateRange,
  setDueDateRange,
  selectedCategories,
  setSelectedCategories,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  handleResetOneWeek
}) {

  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="card shadow-sm p-3 mb-4 bg-light border-0">
      <div className="row g-3 align-items-center">
        
        <div className="row">
            {/* 1. keyword */}
            <div className="col-md-6">
                <label className="form-label small text-muted mb-1">Keyword</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search title or description..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>
            {/* 2. categories */}
            <div className="col-md-6">
                <label className="form-label small text-muted mb-1">Filter Categories (Multi-select)</label>
                <div className="btn-group btn-group-sm w-100" role="group">
                    {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                        <button
                        key={cat}
                        type="button"
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleCategoryToggle(cat)}
                        >
                        {isSelected ? `✓ ${cat}` : cat}
                        </button>
                    );
                    })}
                </div>
            </div>
        </div>

        <div className="row">
            {/* 3. Created At range */}
            <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Created Range</label>
            <div className="input-group input-group-sm">
                <input
                type="date"
                className="form-control"
                value={createdRange.start}
                onChange={(e) => setCreatedRange({ ...createdRange, start: e.target.value })}
                />
                <span className="input-group-text">to</span>
                <input
                type="date"
                className="form-control"
                value={createdRange.end}
                onChange={(e) => setCreatedRange({ ...createdRange, end: e.target.value })}
                />
            </div>
            </div>

            {/* 4. Completed At range */}
            <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Completed Range</label>
            <div className="input-group input-group-sm">
                <input
                type="date"
                className="form-control"
                value={completedRange.start}
                onChange={(e) => setCompletedRange({ ...completedRange, start: e.target.value })}
                />
                <span className="input-group-text">to</span>
                <input
                type="date"
                className="form-control"
                value={completedRange.end}
                onChange={(e) => setCompletedRange({ ...completedRange, end: e.target.value })}
                />
            </div>
            </div>
        </div>

        <div className="row">
            {/* 5. Due Date range */}
            <div className="col-md-6">
                <label className="form-label small text-muted mb-1">Due Date Range</label>
                <div className="input-group input-group-sm">
                    <input
                    type="date"
                    className="form-control"
                    value={dueDateRange.start}
                    onChange={(e) => setDueDateRange({ ...dueDateRange, start: e.target.value })}
                    />
                    <span className="input-group-text">to</span>
                    <input
                    type="date"
                    className="form-control"
                    value={dueDateRange.end}
                    onChange={(e) => setDueDateRange({ ...dueDateRange, end: e.target.value })}
                    />
                </div>
            </div>

            {/* 6. Sorting */}
            <div className="col-md-6">
                <label className="form-label small text-muted mb-1">Sort By</label>
                <div className="input-group input-group-sm">
                    <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    >
                    <option value="created_at">Created At</option>
                    <option value="due_date">Due Date</option>
                    <option value="completed_at">Completed At</option>
                    </select>
                    <select
                    className="form-select"
                    style={{ maxWidth: '130px' }}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    >
                    <option value="desc">DESC ↓</option>
                    <option value="asc">ASC ↑</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="row">
            {/* 7. reset date */}
            <div className="col-md-2 d-flex align-items-end ms-auto">
                <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm w-100 mt-4" 
                    onClick={handleResetOneWeek}
                    title="Reset to past 7 days"
                >
                    Reset Date
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}