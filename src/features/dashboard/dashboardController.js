import { getDashboardSnapshot, loadCaseData as loadCaseDataModel } from "./dashboardModel.js";
import { renderDashboard as renderDashboardView } from "./dashboardView.js";

export function renderDashboard() {
  renderDashboardView(getDashboardSnapshot());
}

export function loadCaseData() {
  return loadCaseDataModel();
}
