<!--
// v0 by Vercel.
// https://v0.dev/t/AfXYpLG
-->
<script lang="ts">
  import { error } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import DepartmentStudentBarChart from "./DepartmentStudentBarChart.svelte";
  import NationalityBarChart from "./NationalityBarChart.svelte";

  interface Academic {
    department: string;
    nationality: string;
    academicstatus: string;
    term: string;
  }
  interface DepartmentStudentCounts {
    department: string;
    count: number;
  }

  interface nationalityStudentCounts {
    nationality: string;
    count: number;
  }

  let academicList: Academic[] = [];

  let studentCount: DepartmentStudentCounts[] = [];
  let foreignStudentCount: nationalityStudentCounts[] = [];
  let economicForeignStudentCount: nationalityStudentCounts[] = [];
  let businessForeignStudentCount: nationalityStudentCounts[] = [];

  onMount(async () => {
    const response = await fetch("/api/academic?term=202402");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    academicList = await response.json();

    studentCount = academicList
      .filter((students) => students.academicstatus === "재학생") // 필터링
      .reduce((acc, students) => {
        const existingDepartment = acc.find(
          (item) => item.department === students.department,
        );
        if (existingDepartment) {
          existingDepartment.count++;
        } else {
          acc.push({ department: students.department, count: 1 });
        }
        return acc;
      }, [] as DepartmentStudentCounts[]);
    
      foreignStudentCount = academicList
      .filter((students) => students.academicstatus === "재학생" && students.nationality !="대한민국") // 필터링
      .reduce((acc, students) => {
        const existingNationality = acc.find(
          (item) => item.nationality === students.nationality,
        );
        if (existingNationality) {
          existingNationality.count++;
        } else {
          acc.push({ nationality: students.nationality, count: 1 });
        }
        return acc;
      }, [] as nationalityStudentCounts[]); 
      
      economicForeignStudentCount = academicList
      .filter((students) => students.academicstatus === "재학생" 
          // && students.nationality !="대한민국" 
          && students.department === "경제학부") // 필터링
      .reduce((acc, students) => {
        const existingNationality = acc.find(
          (item) => item.nationality === students.nationality,
        );
        if (existingNationality) {
          existingNationality.count++;
        } else {
          acc.push({ nationality: students.nationality, count: 1 });
        }
        return acc;
      }, [] as nationalityStudentCounts[]);   

      businessForeignStudentCount = academicList
      .filter((students) => students.academicstatus === "재학생" 
          // && students.nationality !="대한민국" 
          && students.department === "경영학부") // 필터링
      .reduce((acc, students) => {
        const existingNationality = acc.find(
          (item) => item.nationality === students.nationality,
        );
        if (existingNationality) {
          existingNationality.count++;
        } else {
          acc.push({ nationality: students.nationality, count: 1 });
        }
        return acc;
      }, [] as nationalityStudentCounts[]);  


  });
</script>

<section class="w-full">
  <main class="container mx-auto px-4 md:px-6 py-8">
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">경상대 재학생</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-bold mb-2">재학생수</h3>
          <DepartmentStudentBarChart {studentCount} />
        </div>
        <div>
          <h3 class="text-xl font-bold mb-2">국적별 외국인 재학생수</h3>
          <table>
            <thead>
              <tr>
                <th>국적</th>
                <th>학생수</th>
              </tr>
            </thead>
            <tbody>
              {#each foreignStudentCount as { nationality, count }}
                <tr>
                  <td>{nationality}</td>
                  <td>{count}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">학과별 재학생 국적</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl mb-2 mt-4">경제학부</h3>
          <NationalityBarChart studentCount = {economicForeignStudentCount} 
          chartId="경제학부" />

        </div>
        <div>
          <h3 class="text-xl mb-2 mt-4">경영학부</h3>
          <NationalityBarChart studentCount = {businessForeignStudentCount} 
          chartId="경영학부"/>


        </div>
      </div>
    </section>
  </main>
</section>
<style>
    table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
  }

  th, td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
</style>