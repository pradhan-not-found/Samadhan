import React, { useState } from "react";
import "./Dashboard.css";
import logoImg from "./assets/logo.png";

export default function DashboardUI() {
  const [activeTab, setActiveTab] = useState("categorization");

  const renderSidebarLink = (id, label, icon) => (
    <div
      className={`sidebar-link ${activeTab === id ? "active" : ""}`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      {label}
    </div>
  );

  return (
    <div
      className="dashboard-layout theme-light"
      style={{
        height: "700px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid var(--border-medium)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}
    >
      {/* Sidebar copied from real dashboard */}
      <aside
        className="dashboard-sidebar"
        style={{
          position: "relative",
          height: "100%",
          transform: "none",
          zIndex: 1,
          width: "260px",
          flexShrink: 0,
        }}
      >
        <div className="sidebar-header" style={{ padding: "1.25rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "var(--text-main)",
            }}
          >
            <img
              src={logoImg}
              alt="Samadhan"
              style={{ height: "28px", filter: "brightness(0)" }}
            />
            Samadhan
            <span
              style={{
                fontSize: "0.65rem",
                padding: "0.1rem 0.4rem",
                backgroundColor: "var(--color-primary)",
                color: "white",
                borderRadius: "4px",
                marginLeft: "0.2rem",
                fontWeight: 600,
              }}
            >
              PRO
            </span>
          </div>
        </div>

        <div className="sidebar-nav-group">
          {renderSidebarLink(
            "home",
            "Home",
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>,
          )}
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">
            Citizen Tools
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
          {renderSidebarLink(
            "my-reports",
            "My Reports",
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>,
          )}
          {renderSidebarLink(
            "track-report",
            "Track Report",
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <line x1="12" y1="2" x2="12" y2="4"></line>
              <line x1="12" y1="20" x2="12" y2="22"></line>
              <line x1="20" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="12" x2="4" y2="12"></line>
            </svg>,
          )}
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">
            AI Platform
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
          {renderSidebarLink(
            "categorization",
            "Issue Categorization",
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 12h4l2-9 4 18 2-9h4"></path>
            </svg>,
          )}
          {renderSidebarLink(
            "auto-routing",
            "Auto-Routing",
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>,
          )}
        </div>
      </aside>

      <main
        className="dashboard-main"
        style={{
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: "var(--bg-main)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <h1
              className="dashboard-title"
              style={{ fontSize: "1.8rem", color: "#111" }}
            >
              AI Issue Categorization
            </h1>
            <p
              style={{
                color: "var(--text-faint)",
                marginTop: "0.35rem",
                fontSize: "0.95rem",
              }}
            >
              Gemma 4 processing live citizen reports.
            </p>
          </div>
          <div
            className="credits-pill"
            style={{
              backgroundColor: "#10b98115",
              color: "#10b981",
              border: "1px solid #10b98130",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            System Active
          </div>
        </header>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          <div
            className="dashboard-card"
            style={{
              flex: 1,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: "380px",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                color: "var(--text-main)",
                fontSize: "1.1rem",
              }}
            >
              Incoming Report Analysis
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.6,
                fontSize: "0.95rem",
                marginBottom: "1.5rem",
                maxWidth: "90%",
              }}
            >
              Samadhan uses advanced AI to automatically tag, categorize, and
              route incoming reports. A simple photo of a pothole is analyzed,
              tagged as "Infrastructure - Road Repair", assigned High Severity,
              and routed to the correct municipal department instantly.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "auto" }}>
              <div
                style={{
                  padding: "1.25rem",
                  backgroundColor: "#eff6ff",
                  borderRadius: "12px",
                  border: "1px solid #bfdbfe",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#3b82f6",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                  }}
                >
                  Confidence Score
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "#1d4ed8",
                    marginTop: "0.25rem",
                  }}
                >
                  98%
                </div>
              </div>
              <div
                style={{
                  padding: "1.25rem",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "12px",
                  border: "1px solid #a7f3d0",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#10b981",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                  }}
                >
                  Routing Target
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#047857",
                    marginTop: "0.25rem",
                  }}
                >
                  PWD Dept
                </div>
              </div>
            </div>
            <button
              style={{
                marginTop: "2rem",
                width: "100%",
                padding: "1rem",
                backgroundColor: "#111",
                color: "#fff",
                borderRadius: "10px",
                border: "none",
                fontWeight: 600,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 16 16 12 12 8"></polyline>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Auto-Assign Ticket
            </button>
          </div>

          <div
            style={{
              width: "340px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                color: "var(--text-main)",
                fontSize: "1.1rem",
              }}
            >
              Recent Categorizations
            </h3>

            <div
              className="dashboard-card"
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  backgroundColor: "#eff6ff",
                  display: "grid",
                  placeItems: "center",
                  color: "#3b82f6",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 12 3a4.65 4.65 0 0 0-4.5 4.5c0 1.95 1.5 3.5 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.2rem",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Broken Streetlight
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.4rem",
                      backgroundColor: "#eff6ff",
                      color: "#3b82f6",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                  >
                    Medium
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                  Electrical � Sector 4
                </div>
              </div>
            </div>

            <div
              className="dashboard-card"
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  backgroundColor: "#fef2f2",
                  display: "grid",
                  placeItems: "center",
                  color: "#ef4444",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.2rem",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Water Pipe Leak
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.4rem",
                      backgroundColor: "#fef2f2",
                      color: "#ef4444",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                  >
                    High
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                  Water Board � Main Rd
                </div>
              </div>
            </div>

            <div
              className="dashboard-card"
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  backgroundColor: "#fffbeb",
                  display: "grid",
                  placeItems: "center",
                  color: "#f59e0b",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.2rem",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Garbage Dump
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.4rem",
                      backgroundColor: "#fffbeb",
                      color: "#f59e0b",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                  >
                    Low
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                  Sanitation � Market Area
                </div>
              </div>
            </div>

            <div
              className="dashboard-card"
              style={{
                padding: "1.25rem 1.5rem",
                marginTop: "1rem",
                backgroundColor: "#fdfdfd",
                border: "1px solid var(--border-medium)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                }}
              >
                Want to use this API?
              </span>
              <button
                style={{
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "#111",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Get API Keys
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
