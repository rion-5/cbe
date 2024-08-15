<script lang="ts">
    import { onMount } from "svelte";
    import DepartmentCountsBarChart from "./DepartmentCountsBarChart.svelte";
    import RankArcChart from "./RankArcChart.svelte";
    import DepartmentRankArcChart from "./DepartmentRankArcChart.svelte";

    interface Faculty {
        department: string;
        rank: string;
        retirementTrack: string;
        foreigner: string;
    }

    interface DepartmentCounts {
        department: string;
        count: number;
    }
    interface ProfessorRank {
        rank: string;
        count: number;
    }
    interface DepartmentRank {
        department: string;
        rankData: ProfessorRank[];
        // rankData: { rank: string; count: number }[];
    }

    // type RankData = {
    //     rank: string;
    //     count: number;
    // };

    let facultyList: Faculty[] = [];
    let tenureTrackFaculty: Faculty[] = [];
    let departmentCounts: DepartmentCounts[] = [];

    let rankEconomics: ProfessorRank[] = [];

    let departmentRank: DepartmentRank[] = [];

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    onMount(async () => {
        const response = await fetch(`${apiBaseUrl}/faculty`);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data: {
            department: string;
            rank: string;
            retirementTrack: string;
            foreigner: string;
        }[] = await response.json();

        // 데이터 추출 및 변환
        facultyList = data.map((d) => ({
            department: d.department,
            rank: d.rank,
            retirementTrack: d.retirementTrack,
            foreigner: d.foreigner,
        }));
        // console.log(JSON.stringify(facultyList, null, 2));

        tenureTrackFaculty = data.filter(
            (faculty) => faculty.retirementTrack === "정년트랙",
        );

        departmentCounts = data
            .filter((faculty) => faculty.retirementTrack === "정년트랙") // 필터링
            .reduce((acc, faculty) => {
                const existingDepartment = acc.find(
                    (item) => item.department === faculty.department,
                );
                if (existingDepartment) {
                    existingDepartment.count++;
                } else {
                    acc.push({ department: faculty.department, count: 1 });
                }
                return acc;
            }, [] as DepartmentCounts[]);

        //console.log(JSON.stringify(departmentCounts, null, 2));

        rankEconomics = data
            .filter(
                (faculty) =>
                    faculty.retirementTrack === "정년트랙" &&
                    faculty.department === "경제학부",
            )
            .reduce((acc, faculty) => {
                const existingRank = acc.find(
                    (item) => item.rank === faculty.rank,
                );
                if (existingRank) {
                    existingRank.count++;
                } else {
                    acc.push({ rank: faculty.rank, count: 1 });
                }
                return acc;
            }, [] as ProfessorRank[]);

        data.filter((item) => item.retirementTrack === "정년트랙").forEach(
            (item) => {
                let department = departmentRank.find(
                    (dept) => dept.department === item.department,
                );

                if (!department) {
                    department = { department: item.department, rankData: [] };
                    departmentRank.push(department);
                }

                let rankData = department.rankData.find(
                    (rank) => rank.rank === item.rank,
                );

                if (!rankData) {
                    rankData = { rank: item.rank, count: 0 };
                    department.rankData.push(rankData);
                }

                rankData.count++;
            },
        );
        console.log(JSON.stringify(departmentRank, null, 2));
    });
</script>

<div class="container">
    <h1>경상대 교원현황</h1>
    <div class="row">
        <div>
            <h2>전임교원</h2>
            <div class="responsive-svg-container">
                <DepartmentCountsBarChart {departmentCounts} />
            </div>
        </div>
        <div>
            <h2>경제학부</h2>
            <div class="responsive-svg-container">
                <RankArcChart {rankEconomics} />
            </div>
        </div>
        <div>
            <h2>학부별 교원구성</h2>
            <div class="responsive-svg-container">
                <DepartmentRankArcChart {departmentRank} />
            </div>
        </div>
    </div>
</div>

{#each departmentRank as item}
    <li>
        학과: {item.department} 직급: {item.rankData}
    </li>
{/each}
