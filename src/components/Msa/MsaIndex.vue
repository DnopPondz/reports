<template>
  <!-- ✅ Page root: lock to viewport and prevent page scroll -->
  <div class="h-dvh w-full overflow-hidden bg-gray-50">
    <!-- ✅ internal padding + column layout -->
    <div class="h-full w-full px-3 sm:px-5 lg:px-6 flex flex-col min-h-0">
      <!-- Header (no scroll) -->
      <div class="shrink-0 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between pt-3">
        <div class="min-w-0">
          <h2 class="font-bold text-xl sm:text-2xl tracking-tight">Movaci MSA</h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="px-3 py-2 text-xs rounded-xl border bg-white hover:bg-gray-50 active:scale-[0.99] transition"
            @click="reset"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Summary Bar (no scroll) -->
      <div class="shrink-0 mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <SummaryCard label="Total" :value="rows.length" />
        <SummaryCard label="Signed" :value="countBy('Signed')" badge="Signed" />
        <SummaryCard label="Pending" :value="countBy('Pending')" badge="Pending" />
        <SummaryCard label="Monthly/Annually" :value="countBy('Monthly') + countBy('Annually')" />
      </div>

      <!-- ✅ Main: takes remaining space only, no page scroll -->
      <div class="flex-1 min-h-0 overflow-hidden mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 pb-3">
        <!-- LEFT: List -->
        <div class="lg:col-span-5 xl:col-span-4 flex flex-col min-h-0 overflow-hidden">
          <div class="rounded-2xl border bg-white shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
            <!-- Filters (no scroll) -->
            <div class="shrink-0 p-3 border-b bg-white rounded-t-2xl">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <div class="relative flex-1">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">⌕</span>
                    <input
                      v-model="q"
                      class="w-full pl-8 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring"
                      placeholder="Search company / location / BRM / remark..."
                    />
                  </div>

                  <select v-model="statusFilter" class="px-3 py-2 rounded-xl border text-sm bg-white">
                    <option value="">All</option>
                    <option value="Signed">Signed</option>
                    <option value="Pending">Pending</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>

                <div class="flex items-center justify-between text-[11px] text-gray-600">
                  <p>
                    Showing <span class="font-semibold text-gray-900">{{ filteredRows.length }}</span> rows
                  </p>
                  <div class="flex items-center gap-2">
                    <button
                      class="px-2 py-1 rounded-lg border bg-white hover:bg-gray-50"
                      :class="viewMode === 'compact' ? 'border-gray-900 text-gray-900' : ''"
                      @click="viewMode = 'compact'"
                    >
                      Compact
                    </button>
                    <button
                      class="px-2 py-1 rounded-lg border bg-white hover:bg-gray-50"
                      :class="viewMode === 'cozy' ? 'border-gray-900 text-gray-900' : ''"
                      @click="viewMode = 'cozy'"
                    >
                      Cozy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ LIST SCROLL AREA (only this scrolls on left) -->
            <div class="flex-1 min-h-0 overflow-auto overscroll-contain p-2 scroll-area">
              <button
                v-for="row in filteredRows"
                :key="row.cid"
                class="w-full text-left rounded-2xl border bg-white hover:bg-gray-50 transition mb-2"
                :class="selected?.cid === row.cid ? 'border-gray-900 shadow-sm' : 'border-gray-200'"
                @click="selectRow(row)"
              >
                <div class="p-3" :class="viewMode === 'compact' ? 'py-2' : ''">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold truncate">
                        <span class="text-gray-900">{{ row.company }}</span>
                        <span class="text-gray-400 font-normal">#{{ row.cid }}</span>
                      </p>
                      <p class="text-[12px] text-gray-600 truncate">
                        {{ row.location }} • {{ row.serviceType }}
                      </p>
                    </div>

                    <div class="shrink-0 flex items-center gap-2">
                      <span class="chip" :class="signedChipClass(row.signed)">
                        {{ row.signed || "—" }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <span class="pill">BRM: {{ v(row.brm) }}</span>
                    <span class="pill">M365: {{ v(row.m365?.tier) }}</span>
                    <span class="pill">Pkg: {{ v(row.package?.tier) }}</span>
                    <span class="pill">Backup: {{ v(row.activeBackup365) }}</span>
                  </div>

                  <div v-if="row.remark" class="mt-2 text-[11px] text-gray-600 line-clamp-2">
                    {{ row.remark }}
                  </div>
                </div>
              </button>

              <div v-if="!filteredRows.length" class="py-10 text-center text-sm text-gray-500">
                No data
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Detail -->
        <div class="lg:col-span-7 xl:col-span-8 flex flex-col min-h-0 overflow-hidden">
          <div class="rounded-2xl border bg-white shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
            <!-- Detail Header (no scroll) -->
            <div class="shrink-0 p-4 border-b flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-gray-500">Selected</p>
                <p class="text-lg font-bold truncate">
                  {{ selected ? `${selected.cid} — ${selected.company}` : "Select a company" }}
                </p>
                <p class="text-[12px] text-gray-600">
                  {{ selected ? `${selected.location} • ${selected.serviceType}` : "—" }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <span v-if="selected" class="chip" :class="signedChipClass(selected.signed)">
                  {{ selected.signed || "—" }}
                </span>
              </div>
            </div>

            <!-- Tabs (no scroll) -->
            <div class="shrink-0 px-3 pt-3">
              <div class="flex gap-2 overflow-auto pb-2 scroll-area">
                <button v-for="t in tabs" :key="t" :class="tabBtnClass(t)" @click="viewTab = t">
                  {{ t }}
                </button>
              </div>
            </div>

            <!-- ✅ DETAIL SCROLL AREA (only this scrolls on right) -->
            <div class="flex-1 min-h-0 overflow-auto overscroll-contain p-3 scroll-area">
              <div v-if="!selected" class="h-full grid place-items-center text-sm text-gray-500">
                เลือกบริษัทจากรายการทางซ้ายเพื่อดูรายละเอียด
              </div>

              <div v-else class="text-[12px]">
                <!-- All -->
                <div v-if="viewTab === 'All'" class="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <SectionCard title="Base Info" icon="🏢">
                    <KV label="CID" :value="selected.cid" />
                    <KV label="Company Name" :value="selected.company" />
                    <KV label="Location" :value="selected.location" />
                    <KV label="Service Type" :value="selected.serviceType" />
                  </SectionCard>

                  <SectionCard title="Signed / Remark / BRM" icon="📝">
                    <KV label="Signed" :value="selected.signed" />
                    <KV label="BRM" :value="selected.brm" />
                    <KV label="Remark" :value="selected.remark" multiline />
                  </SectionCard>

                  <SectionCard title="Support Hours" icon="🕒">
                    <KV label="SD" :value="selected.supportHours.sd" />
                    <KV label="TS" :value="selected.supportHours.ts" />
                    <KV label="VCIO" :value="selected.supportHours.vcio" />
                  </SectionCard>

                  <SectionCard title="Package" icon="📦">
                    <KV label="User" :value="selected.package.user" />
                    <KV label="Tier" :value="selected.package.tier" />
                    <KV label="Workstation" :value="selected.package.workstation" />
                    <KV label="Tier2" :value="selected.package.tier2" />
                    <KV label="Server" :value="selected.package.server" />
                    <KV label="Tier3" :value="selected.package.tier3" />
                    <KV label="Network" :value="selected.package.network" />
                    <KV label="Tier4" :value="selected.package.tier4" />
                    <KV label="Security" :value="selected.package.security" />
                    <KV label="Tier5" :value="selected.package.tier5" />
                  </SectionCard>

                  <SectionCard title="M365" icon="☁️">
                    <KV label="M365 (User)" :value="selected.m365.user" />
                    <KV label="Tier" :value="selected.m365.tier" />
                    <KV label="M365 Tenant/Tier" :value="selected.m365.tenantTier" />
                    <KV label="Tenant Security" :value="selected.m365.tenantSecurity" />
                  </SectionCard>

                  <SectionCard title="Web & Backup" icon="🛡️">
                    <KV label="Active Back up 365" :value="selected.activeBackup365" />
                    <KV label="Web Maintenance" :value="selected.webMaintenance" />
                    <KV label="Security Audit" :value="selected.securityAudit" />
                  </SectionCard>
                </div>

                <!-- Overview -->
                <div v-else-if="viewTab === 'Overview'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <MiniCard title="Support" icon="🕒">
                    <p>SD: {{ v(selected.supportHours.sd) }}</p>
                    <p>TS: {{ v(selected.supportHours.ts) }}</p>
                    <p>VCIO: {{ v(selected.supportHours.vcio) }}</p>
                  </MiniCard>

                  <MiniCard title="Package" icon="📦">
                    <p>User: {{ v(selected.package.user) }}</p>
                    <p>Tier: {{ v(selected.package.tier) }}</p>
                    <p>
                      WS: {{ v(selected.package.workstation) }} • SV: {{ v(selected.package.server) }} •
                      NW: {{ v(selected.package.network) }} • Sec: {{ v(selected.package.security) }}
                    </p>
                  </MiniCard>

                  <MiniCard title="M365" icon="☁️">
                    <p>User: {{ v(selected.m365.user) }}</p>
                    <p>Tier: {{ v(selected.m365.tier) }}</p>
                    <p>Tenant/Tier: {{ v(selected.m365.tenantTier) }}</p>
                    <p>Tenant Sec: {{ v(selected.m365.tenantSecurity) }}</p>
                  </MiniCard>
                </div>

                <!-- Package -->
                <div v-else-if="viewTab === 'Package'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <MiniCard title="Users / Tier" icon="👤">
                    <p>User: {{ v(selected.package.user) }}</p>
                    <p>Tier: {{ v(selected.package.tier) }}</p>
                  </MiniCard>

                  <MiniCard title="Infra" icon="🧩">
                    <p>Workstation: {{ v(selected.package.workstation) }}</p>
                    <p>Server: {{ v(selected.package.server) }}</p>
                    <p>Network: {{ v(selected.package.network) }}</p>
                    <p>Security: {{ v(selected.package.security) }}</p>
                  </MiniCard>

                  <MiniCard title="Tier Details" icon="🏷️">
                    <p>Tier2: {{ v(selected.package.tier2) }}</p>
                    <p>Tier3: {{ v(selected.package.tier3) }}</p>
                    <p>Tier4: {{ v(selected.package.tier4) }}</p>
                    <p>Tier5: {{ v(selected.package.tier5) }}</p>
                  </MiniCard>
                </div>

                <!-- M365 -->
                <div v-else-if="viewTab === 'M365'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <MiniCard title="M365 (User)" icon="👤">
                    <p>{{ v(selected.m365.user) }}</p>
                  </MiniCard>

                  <MiniCard title="Tier" icon="🏷️">
                    <p>{{ v(selected.m365.tier) }}</p>
                  </MiniCard>

                  <MiniCard title="Tenant" icon="🏢">
                    <p>Tenant/Tier: {{ v(selected.m365.tenantTier) }}</p>
                    <p>Tenant Sec: {{ v(selected.m365.tenantSecurity) }}</p>
                  </MiniCard>
                </div>

                <!-- Web & Backup -->
                <div v-else-if="viewTab === 'Web & Backup'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <MiniCard title="Active Back up 365" icon="💾">
                    <p>{{ v(selected.activeBackup365) }}</p>
                  </MiniCard>

                  <MiniCard title="Web Maintenance" icon="🌐">
                    <p>{{ v(selected.webMaintenance) }}</p>
                  </MiniCard>

                  <MiniCard title="Security Audit" icon="🛡️">
                    <p>{{ v(selected.securityAudit) }}</p>
                  </MiniCard>
                </div>

                <!-- Notes -->
                <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <SectionCard title="Remark" icon="📝">
                    <p class="text-gray-700 break-words">{{ v(selected.remark) }}</p>
                  </SectionCard>
                  <SectionCard title="BRM" icon="🤝">
                    <p class="text-gray-700">{{ v(selected.brm) }}</p>
                  </SectionCard>
                </div>
              </div>
            </div>

            <!-- Footer (no scroll) -->
            <div class="shrink-0 p-3 border-t text-[11px] text-gray-500">
              * Tab “All” = โชว์ครบทุกคอลัมน์ตามไฟล์ในรูป
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h, ref, watchEffect } from "vue";

/** data ... (เหมือนเดิม) */
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
    m365: { user: 74, tier: "Premium", tenantTier: "Premium", tenantSecurity: "Premium" },
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
    m365: { user: "3 hrs/month", tier: "Basic", tenantTier: "Basic", tenantSecurity: "" },
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
    m365: { user: "3 hrs/month", tier: "Basic", tenantTier: "Basic", tenantSecurity: "" },
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
    m365: { user: 5, tier: "Standard", tenantTier: "Standard", tenantSecurity: "Standard" },
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
    m365: { user: null, tier: "Premium", tenantTier: "Premium", tenantSecurity: "Premium" },
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
    m365: { user: 16, tier: "Premium", tenantTier: 1, tenantSecurity: "Premium" },
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
    m365: { user: 16, tier: "Basic", tenantTier: "Standard", tenantSecurity: "Standard" },
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
    m365: { user: "10 (3 hrs/month)", tier: "Basic", tenantTier: "Basic", tenantSecurity: "" },
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
    m365: { user: "3 hrs/month", tier: "Basic", tenantTier: "", tenantSecurity: "" },
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
    m365: { user: 14, tier: "Standard", tenantTier: "Premium", tenantSecurity: "Premium" },
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
    m365: { user: null, tier: "", tenantTier: "Standard", tenantSecurity: "Standard" },
    activeBackup365: "",
    webMaintenance: "",
    securityAudit: "",
    signed: "Signed",
    remark: "February 1, 2025 to January 31, 2026/automatically continue on a monthly",
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
    m365: { user: 20, tier: "Premium", tenantTier: "Standard", tenantSecurity: "" },
    activeBackup365: "Yes",
    webMaintenance: "2 Site Premium",
    securityAudit: "",
    signed: "Signed",
    remark: "Contract end 30th June 2026",
    brm: "Marvin",
  },
]);

const q = ref("");
const statusFilter = ref("");
const viewMode = ref("cozy");
const viewTab = ref("All");
const tabs = ["All", "Overview", "Package", "M365", "Web & Backup", "Notes"];

const selected = ref(null);
watchEffect(() => {
  if (!selected.value && rows.value.length) selected.value = rows.value[0];
});

const selectRow = (row) => (selected.value = row);

const filteredRows = computed(() => {
  const keyword = q.value.trim().toLowerCase();

  return rows.value.filter((r) => {
    const hit =
      !keyword ||
      [
        r.cid,
        r.company,
        r.location,
        r.serviceType,
        r.brm,
        r.remark,
        r.signed,
        r.webMaintenance,
        r.securityAudit,
        r.activeBackup365,
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
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

    const statusOk = !statusFilter.value || r.signed === statusFilter.value;
    return hit && statusOk;
  });
});

const countBy = (val) => rows.value.filter((r) => r.signed === val).length;

const reset = () => {
  q.value = "";
  statusFilter.value = "";
  viewTab.value = "All";
  viewMode.value = "cozy";
};

const tabBtnClass = (t) =>
  [
    "px-3 py-2 rounded-xl border text-xs transition whitespace-nowrap",
    viewTab.value === t ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50",
  ].join(" ");

const signedChipClass = (signed) => {
  if (signed === "Signed") return "bg-green-50 border-green-200 text-green-700";
  if (signed === "Pending") return "bg-yellow-50 border-yellow-200 text-yellow-700";
  if (signed === "Monthly") return "bg-blue-50 border-blue-200 text-blue-700";
  if (signed === "Annually") return "bg-purple-50 border-purple-200 text-purple-700";
  return "bg-gray-50 border-gray-200 text-gray-700";
};

const v = (x) => (x === null || x === undefined || x === "" ? "—" : x);

/** Local components */
const SectionCard = (props, { slots }) =>
  h("div", { class: "rounded-2xl border bg-gray-50 p-4" }, [
    h("div", { class: "flex items-center justify-between mb-3" }, [
      h("p", { class: "font-semibold" }, props.title),
      props.icon ? h("span", { class: "text-sm" }, props.icon) : null,
    ]),
    h("div", { class: "space-y-1" }, slots.default?.()),
  ]);

const KV = (props) =>
  h("div", { class: "text-[12px] leading-relaxed" }, [
    h("span", { class: "text-gray-600" }, `${props.label}: `),
    props.multiline
      ? h("span", { class: "text-gray-900 break-words" }, v(props.value))
      : h("span", { class: "text-gray-900" }, v(props.value)),
  ]);

const MiniCard = (props, { slots }) =>
  h("div", { class: "rounded-2xl border bg-white p-4 shadow-sm" }, [
    h("div", { class: "flex items-center justify-between mb-2" }, [
      h("p", { class: "font-semibold" }, props.title),
      props.icon ? h("span", { class: "text-sm" }, props.icon) : null,
    ]),
    h("div", { class: "text-[12px] text-gray-700 space-y-1" }, slots.default?.()),
  ]);

const SummaryCard = (props) =>
  h("div", { class: "rounded-xl border bg-white px-3 py-2 shadow-sm" }, [
    h("p", { class: "text-[10px] text-gray-600 leading-none" }, props.label),
    h("div", { class: "mt-1 flex items-center justify-between" }, [
      h("p", { class: "text-base font-bold leading-none" }, String(props.value ?? 0)),
      props.badge
        ? h(
            "span",
            { class: ["chip !px-2 !py-0.5 !text-[10px]", signedChipClass(props.badge)].join(" ") },
            props.badge
          )
        : null,
    ]),
  ]);
</script>

<style scoped>
/* chips */
.chip {
  @apply inline-flex items-center px-2 py-1 rounded-lg border text-[11px];
}
.pill {
  @apply inline-flex items-center px-2 py-1 rounded-full border bg-gray-50 text-gray-700;
}

/* ✅ ซ่อน scrollbar เฉพาะพื้นที่ที่เป็นตัวเลื่อน */
.scroll-area {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge เก่า */
}
.scroll-area::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none; /* Chrome/Safari */
}

/* ✅ กัน body / app shell scrollbar ดำขวาสุด (ทำในไฟล์เดียวได้) */
:global(html),
:global(body),
:global(#app) {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>
