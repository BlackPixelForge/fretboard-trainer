"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AccountPanel({ user, subscription }) {
  const [portalLoading, setPortalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalLoading(false);
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setPortalLoading(false);
      alert("Network error. Please check your connection and try again.");
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    } else {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const statusLabels = {
    active: "Active",
    trialing: "Trial",
    canceled: "Canceled",
    past_due: "Past Due",
    unpaid: "Unpaid",
  };

  const statusColors = {
    active: "#50be50",
    trialing: "#3ca0dc",
    canceled: "#ffc832",
    past_due: "#e84e3c",
    unpaid: "#e84e3c",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0a0a0f 0%, #12121c 40%, #0e0e16 100%)",
        padding: "60px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 500, width: "100%" }}>
        {/* Back link */}
        <Link
          href="/app"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 24,
          }}
        >
          &larr; Back to app
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "1.6rem",
            color: "var(--text-primary)",
            margin: "0 0 32px",
            letterSpacing: "-0.02em",
          }}
        >
          Account
        </h1>

        {/* User info */}
        <div
          style={{
            background: "rgba(14,14,22,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            {user.name || "User"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            {user.email}
          </div>
        </div>

        {/* Subscription info */}
        <div
          style={{
            background: "rgba(14,14,22,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Subscription
          </div>

          {subscription ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: statusColors[subscription.status] || "#888",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {statusLabels[subscription.status] || subscription.status}
                </span>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    color: "#ffc832",
                    margin: "0 0 8px",
                  }}
                >
                  Access until {formatDate(subscription.currentPeriodEnd)}
                </p>
              )}

              {!subscription.cancelAtPeriodEnd &&
                subscription.status === "active" && (
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      margin: "0 0 8px",
                    }}
                  >
                    Renews {formatDate(subscription.currentPeriodEnd)}
                  </p>
                )}

              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                style={{
                  marginTop: 12,
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: portalLoading ? "wait" : "pointer",
                  opacity: portalLoading ? 0.7 : 1,
                }}
              >
                {portalLoading
                  ? "Loading..."
                  : "Manage Subscription"}
              </button>
            </>
          ) : (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              No active subscription
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            background: "rgba(14,14,22,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              width: "100%",
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Danger zone */}
        <div
          style={{
            background: "rgba(14,14,22,0.8)",
            border: "1px solid rgba(232,78,60,0.15)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#e84e3c",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Danger Zone
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid rgba(232,78,60,0.3)",
                background: "transparent",
                color: "#e84e3c",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Delete Account
            </button>
          ) : (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  margin: "0 0 12px",
                  lineHeight: 1.5,
                }}
              >
                This will permanently delete your account and all associated
                data. This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "#e84e3c",
                    color: "#fff",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: deleteLoading ? "wait" : "pointer",
                    opacity: deleteLoading ? 0.7 : 1,
                  }}
                >
                  {deleteLoading ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
