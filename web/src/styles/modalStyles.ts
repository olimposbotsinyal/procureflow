import React from "react";

export const modalStyles = {
  // Backdrop (dış alan)
  backdrop: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    zIndex: 9999,
    padding: "20px",
  } as React.CSSProperties,

  // Modal kutusu
  container: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto" as const,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  } as React.CSSProperties,

  // Header bölümü
  header: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingBottom: "12px",
    borderBottom: "1px solid #e0e0e0",
    padding: "16px 20px",
    backgroundColor: "#f5f5f5",
  } as React.CSSProperties,

  // Başlık
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold" as const,
  } as React.CSSProperties,

  // Kapatma butonu
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
  } as React.CSSProperties,

  // Form alanı
  content: {
    padding: "20px",
  } as React.CSSProperties,

  // Hata mesajı
  errorMessage: {
    backgroundColor: "#ffebee",
    border: "1px solid #ff6b6b",
    color: "#d32f2f",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "16px",
    fontSize: "13px",
  } as React.CSSProperties,

  // Grid (2 kolon)
  grid: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "12px",
  } as React.CSSProperties,

  // Input / Select / Textarea
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  // Label
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600 as const,
    marginBottom: "4px",
    color: "#333",
  } as React.CSSProperties,

  // Single column (tam genişlik)
  fullWidth: {
    marginBottom: "12px",
  } as React.CSSProperties,

  // Textarea
  textarea: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    resize: "none" as const,
  } as React.CSSProperties,

  // Checkbox container
  checkboxLabel: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    fontSize: "13px",
  } as React.CSSProperties,

  // Checkbox input
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  } as React.CSSProperties,

  // Footer (button area)
  footer: {
    display: "flex" as const,
    gap: "10px",
    borderTop: "1px solid #e0e0e0",
    paddingTop: "16px",
  } as React.CSSProperties,

  // Primary button
  primaryButton: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    fontSize: "14px",
  } as React.CSSProperties,

  // Primary button disabled
  primaryButtonDisabled: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#ccc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "not-allowed",
    fontWeight: "bold" as const,
    fontSize: "14px",
  } as React.CSSProperties,

  // Secondary button
  secondaryButton: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    fontSize: "14px",
  } as React.CSSProperties,

  // Danger button (Sil)
  dangerButton: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    fontSize: "14px",
  } as React.CSSProperties,
};
