import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Pagination,
} from "react-bootstrap";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiSearch,
  FiMap,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import { trips } from "../data/tripData";
import TripCard from "../components/Cards/TripCard";
import "./tripListing.css";

const TripListingPage = () => {
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("popular");

  // Filter States
  const [filters, setFilters] = useState({
    searchQuery: "",
    minPrice: 0,
    maxPrice: 150000,
    duration: "all",
    difficulty: "all",
    rating: 0,
  });

  const itemsPerPage = 12;

  // Apply filters
  useMemo(() => {
    let result = trips.filter((trip) => {
      // Search query filter
      const matchesSearch =
        trip.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        trip.destination
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      // Price filter
      const matchesPrice = trip.price >= filters.minPrice && trip.price <= filters.maxPrice;

      // Duration filter
      let matchesDuration = true;
      if (filters.duration !== "all") {
        const tripDays = parseInt(trip.duration);
        const filterDays = parseInt(filters.duration);
        if (filters.duration === "short") matchesDuration = tripDays <= 3;
        if (filters.duration === "medium") matchesDuration = tripDays >= 4 && tripDays <= 7;
        if (filters.duration === "long") matchesDuration = tripDays > 7;
      }

      // Difficulty filter
      const matchesDifficulty =
        filters.difficulty === "all" ||
        trip.difficulty.toLowerCase() === filters.difficulty.toLowerCase();

      // Rating filter
      const tripRating = parseFloat(trip.rating);
      const matchesRating = tripRating >= filters.rating;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesDuration &&
        matchesDifficulty &&
        matchesRating
      );
    });

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "newest") {
      result.reverse();
    }
    // popular is default order

    setFilteredTrips(result);
    setCurrentPage(1); // Reset to first page
  }, [filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrips = filteredTrips.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      minPrice: 0,
      maxPrice: 150000,
      duration: "all",
      difficulty: "all",
      rating: 0,
    });
    setSortBy("popular");
  };

  return (
    <div className="trip-listing-page">
      {/* Header */}
      <section className="listing-header">
        <Container>
          <h1 className="listing-title">Explore Amazing Destinations</h1>
          <p className="listing-subtitle">
            Browse and book from {trips.length} carefully curated travel packages
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="listing-content">
        <Container fluid="lg">
          <Row className="g-4">
            {/* Sidebar Filters */}
            <Col lg={3} className={`filter-sidebar ${showFilters ? "show" : "hidden"}`}>
              <div className="filter-header">
                <h4 className="filter-title">
                  <FiFilter /> Filter Trips
                </h4>
                <Button
                  variant="link"
                  className="btn-close-filters"
                  onClick={() => setShowFilters(false)}
                >
                  <FiX />
                </Button>
              </div>

              {/* Search Box */}
              <div className="filter-section">
                <h6 className="filter-section-title">Search</h6>
                <div className="search-box">
                  <FiSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Search destinations..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h6 className="filter-section-title">
                  <FiDollarSign /> Price Range
                </h6>
                <div className="price-inputs">
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="price-input"
                  />
                  <span className="price-separator">-</span>
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", parseInt(e.target.value) || 150000)
                    }
                    className="price-input"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value))}
                  className="price-range"
                />
                <p className="price-display">
                  ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
                </p>
              </div>

              {/* Duration */}
              <div className="filter-section">
                <h6 className="filter-section-title">
                  <FiClock /> Duration
                </h6>
                <div className="filter-options">
                  {[
                    { value: "all", label: "All Durations" },
                    { value: "short", label: "Short (1-3 days)" },
                    { value: "medium", label: "Medium (4-7 days)" },
                    { value: "long", label: "Long (8+ days)" },
                  ].map((option) => (
                    <Form.Check
                      key={option.value}
                      type="radio"
                      name="duration"
                      label={option.label}
                      value={option.value}
                      checked={filters.duration === option.value}
                      onChange={(e) => handleFilterChange("duration", e.target.value)}
                      className="filter-check"
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="filter-section">
                <h6 className="filter-section-title">Difficulty Level</h6>
                <div className="filter-options">
                  {[
                    { value: "all", label: "All Levels" },
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ].map((option) => (
                    <Form.Check
                      key={option.value}
                      type="radio"
                      name="difficulty"
                      label={option.label}
                      value={option.value}
                      checked={filters.difficulty === option.value}
                      onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                      className="filter-check"
                    />
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="filter-section">
                <h6 className="filter-section-title">Minimum Rating</h6>
                <div className="rating-selector">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      className={`rating-btn ${filters.rating === rating ? "active" : ""}`}
                      onClick={() => handleFilterChange("rating", rating)}
                    >
                      {rating === 0 ? "All" : `${rating}+ ⭐`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <Button className="btn-reset-filters w-100" onClick={resetFilters}>
                <FiX /> Clear All Filters
              </Button>
            </Col>

            {/* Trips Grid */}
            <Col lg={9}>
              {/* Toolbar */}
              <div className="listing-toolbar">
                <div className="toolbar-left">
                  <Button
                    variant="secondary"
                    className="btn-toggle-filters"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FiFilter /> Filters
                  </Button>

                  <span className="results-count">
                    Showing {paginatedTrips.length} of {filteredTrips.length} trips
                  </span>
                </div>

                <div className="toolbar-right">
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rated</option>
                    <option value="newest">Newest First</option>
                  </Form.Select>
                </div>
              </div>

              {/* Trips Grid */}
              {filteredTrips.length > 0 ? (
                <>
                  <Row className="trips-grid g-4">
                    {paginatedTrips.map((trip) => (
                      <Col lg={12} md={6} sm={12} key={trip.id}>
                        <TripCard trip={trip} />
                      </Col>
                    ))}
                  </Row>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="pagination-custom">
                      <Pagination.First
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      />

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Pagination.Item
                              key={page}
                              active={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Pagination.Item>
                          );
                        }
                        return null;
                      })}

                      <Pagination.Next
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  )}
                </>
              ) : (
                /* No Results */
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h4 className="no-results-title">No trips found</h4>
                  <p className="no-results-subtitle">
                    Try adjusting your filters to see more results
                  </p>
                  <Button className="btn-reset-filters-large" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default TripListingPage;
