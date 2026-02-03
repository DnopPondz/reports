<template>
  <div class="h-dvh w-full overflow-hidden bg-white">
    <div class="h-full w-full px-4 sm:px-6 lg:px-8 flex flex-col min-h-0">
      <!-- Header -->
      <div class="shrink-0 pt-5">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">
              MSA
            </h2>
          </div>

          <div
            class="w-[360px] max-w-full flex gap-2 justify-center items-center"
          >
            <input
              v-model="q"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300"
              placeholder="Search company / location / remark / BRM..."
            />

            <div className="">
              <button
                class="px-3 py-2 text-xs rounded-xl border bg-white hover:bg-gray-50 active:scale-[0.99] transition"
                @click="goTable"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card -->
      <div
        class="flex-1 min-h-0 overflow-hidden mt-4 border border-slate-200 rounded-xl bg-white"
      >
        <div class="px-4 py-3 border-b border-slate-200">
          <p class="text-sm text-slate-600">
            Showing
            <span class="font-semibold text-slate-900">{{
              filteredRows.length
            }}</span>
            rows
          </p>
        </div>

        <!-- wrapper: column เพื่อให้ footer อยู่ตลอด + table scroll อยู่ข้างบน -->
        <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
          <!-- ✅ Vertical scroll (ตารางเลื่อนขึ้นลง + เลื่อนซ้ายขวาได้ด้วย) -->
          <div
            ref="mainScroll"
            class="table-scroll flex-1 min-h-0 w-full overflow-y-auto overflow-x-auto pb-3"
            style="scrollbar-gutter: stable both-edges"
          >
            <table class="min-w-[2200px] w-max text-[12px]">
              <thead class="sticky top-0 z-10">
                <!-- Group Header -->
                <tr
                  class="bg-slate-50 text-slate-700 border-b border-slate-200"
                >
                  <th class="px-3 py-2 font-semibold text-left" colspan="4">
                    Base
                  </th>
                  <th
                    class="px-3 py-2 font-semibold text-left bg-emerald-50"
                    colspan="3"
                  >
                    Support Hours
                  </th>
                  <th
                    class="px-3 py-2 font-semibold text-left bg-sky-50"
                    colspan="10"
                  >
                    Package
                  </th>
                  <th
                    class="px-3 py-2 font-semibold text-left bg-violet-50"
                    colspan="4"
                  >
                    M365
                  </th>
                  <th
                    class="px-3 py-2 font-semibold text-left bg-rose-50"
                    colspan="1"
                  >
                    Active Back up 365
                  </th>
                  <th
                    class="px-3 py-2 font-semibold text-left bg-fuchsia-50"
                    colspan="2"
                  >
                    Web
                  </th>
                  <th class="px-3 py-2 font-semibold text-left" colspan="3">
                    Other
                  </th>
                </tr>

                <!-- Column Header -->
                <tr
                  class="bg-slate-50 text-slate-600 border-b border-slate-200"
                >
                  <!-- Base -->
                  <th class="px-3 py-2 font-medium text-left">CID</th>
                  <th class="px-3 py-2 font-medium text-left">Company Name</th>
                  <th class="px-3 py-2 font-medium text-left">Location</th>
                  <th class="px-3 py-2 font-medium text-left">Service Type</th>

                  <!-- Support Hours -->
                  <th class="px-3 py-2 font-medium text-left bg-emerald-50">
                    SD
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-emerald-50">
                    TS
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-emerald-50">
                    VCIO
                  </th>

                  <!-- Package -->
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    User
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Tier
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Workstation
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Tier2
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Server
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Tier3
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Network
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Tier4
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Security
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-sky-50">
                    Tier5
                  </th>

                  <!-- M365 -->
                  <th class="px-3 py-2 font-medium text-left bg-violet-50">
                    M365 (User)
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-violet-50">
                    Tier
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-violet-50">
                    Tenant/Tier
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-violet-50">
                    Tenant Security
                  </th>

                  <!-- Active Backup -->
                  <th class="px-3 py-2 font-medium text-left bg-rose-50">
                    Standalone
                  </th>

                  <!-- Web -->
                  <th class="px-3 py-2 font-medium text-left bg-fuchsia-50">
                    Web Maintenance
                  </th>
                  <th class="px-3 py-2 font-medium text-left bg-fuchsia-50">
                    Security Audit
                  </th>

                  <!-- Other -->
                  <th class="px-3 py-2 font-medium text-left">Signed</th>
                  <th class="px-3 py-2 font-medium text-left">Remark</th>
                  <th class="px-3 py-2 font-medium text-left">BRM</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="r in filteredRows"
                  :key="r.cid"
                  class="border-b border-slate-100 hover:bg-slate-50/60"
                >
                  <!-- Base -->
                  <td class="px-3 py-2 font-semibold text-slate-900">
                    {{ r.cid }}
                  </td>
                  <td class="px-3 py-2 text-slate-800">{{ v(r.company) }}</td>
                  <td class="px-3 py-2 text-slate-700">{{ v(r.location) }}</td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.serviceType) }}
                  </td>

                  <!-- Support Hours -->
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.supportHours?.sd) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.supportHours?.ts) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.supportHours?.vcio) }}
                  </td>

                  <!-- Package -->
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.package?.user) }}
                  </td>
                  <td class="px-3 py-2">
                    <span class="pill">{{ tierText(r.package?.tier) }}</span>
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.package?.workstation) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.package?.tier2) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.package?.server) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.package?.tier3) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.package?.network) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.package?.tier4) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ toZero(r.package?.security) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.package?.tier5) }}
                  </td>

                  <!-- M365 -->
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.m365?.user) }}
                  </td>
                  <td class="px-3 py-2">
                    <span class="pill">{{ tierText(r.m365?.tier) }}</span>
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.m365?.tenantTier) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.m365?.tenantSecurity) }}
                  </td>

                  <!-- Active Backup -->
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.activeBackup365) }}
                  </td>

                  <!-- Web -->
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.webMaintenance) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">
                    {{ v(r.securityAudit) }}
                  </td>

                  <!-- Other -->
                  <td class="px-3 py-2 text-slate-700">{{ v(r.signed) }}</td>
                  <td
                    class="px-3 py-2 text-slate-700 whitespace-normal break-words max-w-[520px]"
                  >
                    {{ v(r.remark) }}
                  </td>
                  <td class="px-3 py-2 text-slate-700">{{ v(r.brm) }}</td>
                </tr>

                <tr v-if="!filteredRows.length">
                  <td
                    class="px-3 py-10 text-center text-sm text-slate-500"
                    colspan="23"
                  >
                    No data
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ✅ Horizontal scrollbar ล่าง (โชว์เฉพาะตอน "ไม่ search") -->
          <div v-show="!q" class="shrink-0 border-t border-slate-200">
            <div
              ref="xBar"
              class="xbar w-full overflow-x-auto overflow-y-hidden"
            >
              <!-- spacer ให้กว้างเท่าตาราง -->
              <div class="min-w-[2200px] w-max h-[14px]"></div>
            </div>
          </div>

          <!-- ✅ Footer note อยู่ตลอด (ไม่เลื่อนตามตาราง) -->
          <div
            class="shrink-0 px-4 py-3 text-[11px] text-slate-500 border-t border-slate-200"
          >
            * Mobile: scroll horizontally to view all columns.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goTable = () => {
  router.push({ name: "MsaIndex" }); // หรือใช้ path "/msa-table"
  // router.push("/msa-table");
};

/** DATA */
const rows = ref([
  {
    cid: 72,
    company: "VOM Canada (VCA)",
    location: "Canada",
    serviceType: "MSA",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: 22,
      tier: "Premium",
      workstation: 3,
      tier2: "Standard",
      server: 22,
      tier3: "Standard",
      network: 8,
      tier4: "5 Standard + 3 Basic",
      security: 3,
      tier5: "Basic",
    },
    m365: {
      user: 74,
      tier: "Premium",
      tenantTier: "Premium",
      tenantSecurity: "Premium",
    },
    activeBackup365: "Yes",
    webMaintenance: "2 Site Standard",
    securityAudit: "Web + Network",
    signed: "Signed",
    remark: "",
    brm: "Mike",
  },
  {
    cid: 77,
    company: "Cornerstone (CCF)",
    location: "Thailand",
    serviceType: "MSA",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: 16,
      tier4: "2 Standard + 14 Basic",
      security: 1,
      tier5: "Standard",
    },
    m365: { user: 40, tier: "Standard", tenantTier: "", tenantSecurity: "" },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Signed",
    remark: "",
    brm: "Sales",
  },
  {
    cid: 151,
    company: "Fort Sherman",
    location: "USA",
    serviceType: "MSA",
    supportHours: { sd: 3, ts: 1, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: 12,
      tier2: "",
      server: 2,
      tier3: "",
      network: 2,
      tier4: "",
      security: 1,
      tier5: "",
    },
    m365: { user: "Yes", tier: "", tenantTier: "", tenantSecurity: "" },
    activeBackup365: "12",
    webMaintenance: "",
    securityAudit: "",
    signed: "Signed",
    remark: "Contract 3 years from 2023 - 2026",
    brm: "Mike",
  },
  {
    cid: 117,
    company: "VOM Korea",
    location: "Korea",
    serviceType: "MSA",
    supportHours: { sd: 14, ts: 3, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: 34,
      tier2: "",
      server: null,
      tier3: "",
      network: 37,
      tier4: "",
      security: 85,
      tier5: "",
    },
    m365: { user: 29, tier: "", tenantTier: "", tenantSecurity: "" },
    activeBackup365: "",
    webMaintenance: "1 Site",
    securityAudit: "",
    signed: "Pending",
    remark: "",
    brm: "Marvin",
  },
  {
    cid: 135,
    company: "The Hug Project",
    location: "Thailand",
    serviceType: "Active Back up",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: { user: null, tier: "", tenantTier: "", tenantSecurity: "" },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "",
    remark: "",
    brm: "",
  },
  {
    cid: 165,
    company: "Harvest Field Cornres",
    location: "USA",
    serviceType: "M365 Management - S package",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: {
      user: "3 hrs/month",
      tier: "Basic",
      tenantTier: "Basic",
      tenantSecurity: "",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Annually",
    remark: "",
    brm: "Mike",
  },
  {
    cid: 447,
    company: "Harvest Bridge",
    location: "USA",
    serviceType: "M365 Management - S package",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: {
      user: "3 hrs/month",
      tier: "Basic",
      tenantTier: "Basic",
      tenantSecurity: "",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Monthly",
    remark: "",
    brm: "Mike",
  },
  {
    cid: 449,
    company: "Village Ministries",
    location: "USA",
    serviceType: "MSA",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: 5,
      tier: "Basic",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: {
      user: 5,
      tier: "Standard",
      tenantTier: "Standard",
      tenantSecurity: "Standard",
    },
    activeBackup365: "",
    webMaintenance: "1 Site Standard",
    securityAudit: "",
    signed: "Signed",
    remark: "By user, no overage",
    brm: "Mike",
  },
  {
    cid: 500,
    company: "C&MA",
    location: "USA",
    serviceType: "MSA",
    supportHours: { sd: 160, ts: 320, vcio: 0 },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: {
      user: null,
      tier: "Premium",
      tenantTier: "Premium",
      tenantSecurity: "Premium",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "",
    remark: "Same as 2024",
    brm: "Mike",
  },
  {
    cid: 622,
    company: "China Aid (CAA)",
    location: "USA",
    serviceType: "MSA",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: 5,
      tier: "Premium",
      workstation: 1,
      tier2: "Basic",
      server: 7,
      tier3: "Standard",
      network: 9,
      tier4: "7 Basic + 2 Standard",
      security: 1,
      tier5: "Premium",
    },
    m365: {
      user: 16,
      tier: "Premium",
      tenantTier: 1,
      tenantSecurity: "Premium",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Signed",
    remark: "By user, no overage / + 1 System Support (Standard)",
    brm: "Mike",
  },
  {
    cid: 1042,
    company: "IAM",
    location: "USA",
    serviceType: "MSA",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: 12,
      tier: "Standard",
      workstation: 10,
      tier2: "Standard",
      server: 3,
      tier3: "Standard",
      network: 20,
      tier4: "15 Basic + 5 Standard",
      security: 1,
      tier5: "Standard",
    },
    m365: {
      user: 16,
      tier: "Basic",
      tenantTier: "Standard",
      tenantSecurity: "Standard",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Signed",
    remark: "By user, no overage/ April 1, 2025 to March 31, 2026",
    brm: "Mike",
  },
  {
    cid: 1127,
    company: "Kontakt Mission USA",
    location: "USA",
    serviceType: "M365 Management - S package",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: {
      user: "10 (3 hrs/month)",
      tier: "Basic",
      tenantTier: "Basic",
      tenantSecurity: "",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Monthly",
    remark: "",
    brm: "Mike",
  },
  {
    cid: 1118,
    company: "Robert Lister (HFA)",
    location: "Australia",
    serviceType: "Website Maintenance",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: { user: null, tier: "", tenantTier: "", tenantSecurity: "" },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "",
    remark: "Monthly maintenance and security review",
    brm: "Marvin",
  },
  {
    cid: 1105,
    company: "Mind Tools",
    location: "Thailand",
    serviceType: "M365 Management - S package",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: {
      user: "3 hrs/month",
      tier: "Basic",
      tenantTier: "",
      tenantSecurity: "",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Annually",
    remark: "",
    brm: "",
  },
  {
    cid: 1150,
    company: "Mission Resource Network - MRN",
    location: "USA",
    serviceType: "MSA",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: 3,
      tier4: "Standard",
      security: 1,
      tier5: "Standard",
    },
    m365: {
      user: 14,
      tier: "Standard",
      tenantTier: "Premium",
      tenantSecurity: "Premium",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Signed",
    remark: "not found 2026 contract",
    brm: "Mike",
  },
  {
    cid: 1158,
    company: "Global Partners",
    location: "Singapore",
    serviceType: "MSA - M365",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: null,
      tier: "",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: null,
      tier4: "",
      security: null,
      tier5: "",
    },
    m365: {
      user: null,
      tier: "",
      tenantTier: "Standard",
      tenantSecurity: "Standard",
    },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Signed",
    remark:
      "February 1, 2025 to January 31, 2026/automatically continue on a monthly",
    brm: "Mike",
  },
  {
    cid: 1167,
    company: "Vom Australia",
    location: "Australia",
    serviceType: "MSA",
    supportHours: { sd: null, ts: null, vcio: null },
    package: {
      user: 20,
      tier: "Standard",
      workstation: null,
      tier2: "",
      server: null,
      tier3: "",
      network: 15,
      tier4: "12 Basic + 3 Standard",
      security: 1,
      tier5: "Standard",
    },
    m365: {
      user: 20,
      tier: "Premium",
      tenantTier: "Standard",
      tenantSecurity: "",
    },
    activeBackup365: "Yes",
    webMaintenance: "2 Site Premium",
    securityAudit: "",
    signed: "Signed",
    remark: "Contract end 30th June 2026",
    brm: "Marvin",
  },
]);

const q = ref("");

const filteredRows = computed(() => {
  const keyword = q.value.trim().toLowerCase();
  if (!keyword) return rows.value;

  return rows.value.filter((r) => {
    const hay = [
      r.cid,
      r.company,
      r.location,
      r.serviceType,
      r.signed,
      r.remark,
      r.brm,
      r.supportHours?.sd,
      r.supportHours?.ts,
      r.supportHours?.vcio,
      r.package?.user,
      r.package?.tier,
      r.package?.workstation,
      r.package?.tier2,
      r.package?.server,
      r.package?.tier3,
      r.package?.network,
      r.package?.tier4,
      r.package?.security,
      r.package?.tier5,
      r.m365?.user,
      r.m365?.tier,
      r.m365?.tenantTier,
      r.m365?.tenantSecurity,
      r.activeBackup365,
      r.webMaintenance,
      r.securityAudit,
    ]
      .join(" ")
      .toLowerCase();

    return hay.includes(keyword);
  });
});

const v = (x) => (x === null || x === undefined || x === "" ? "—" : x);
const toZero = (x) => (x === null || x === undefined || x === "" ? 0 : x);
const tierText = (x) => (x === null || x === undefined || x === "" ? "—" : x);

/** ✅ Scroll sync */
const mainScroll = ref(null);
const xBar = ref(null);

let lock = false;

const syncFromMain = () => {
  if (lock) return;
  lock = true;
  if (xBar.value && mainScroll.value)
    xBar.value.scrollLeft = mainScroll.value.scrollLeft;
  lock = false;
};

const syncFromBar = () => {
  if (lock) return;
  lock = true;
  if (xBar.value && mainScroll.value)
    mainScroll.value.scrollLeft = xBar.value.scrollLeft;
  lock = false;
};

onMounted(() => {
  mainScroll.value?.addEventListener("scroll", syncFromMain, { passive: true });
  xBar.value?.addEventListener("scroll", syncFromBar, { passive: true });
});

onBeforeUnmount(() => {
  mainScroll.value?.removeEventListener("scroll", syncFromMain);
  xBar.value?.removeEventListener("scroll", syncFromBar);
});

watch(q, async () => {
  await nextTick();
  syncFromMain();
});
</script>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 11px;
  color: #334155;
}

/* ✅ ทำให้ scrollbar แนวนอน "เห็นชัด" */
.table-scroll::-webkit-scrollbar {
  height: 12px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 999px;
}
.table-scroll::-webkit-scrollbar-track {
  background: #f8fafc;
}

/* ✅ แถบล่าง */
.xbar::-webkit-scrollbar {
  height: 12px;
}
.xbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 999px;
}
.xbar::-webkit-scrollbar-track {
  background: #f8fafc;
}

/* Firefox */
.table-scroll,
.xbar {
  scrollbar-width: auto;
  -webkit-overflow-scrolling: touch;
}

/* กัน body / app shell scrollbar ดำขวาสุด */
:global(html),
:global(body),
:global(#app) {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>
