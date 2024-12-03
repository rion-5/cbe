<script lang="ts">
    import { onMount } from "svelte";
    // import DepartmentCountsBarChart from "./DepartmentCountsBarChart.svelte";
    // import RankArcChart from "./RankArcChart.svelte_o";
    import DepartmentRankArcChart from "./DepartmentRankArcChart.svelte";
    import DepartmentPositionBarChart from "./DepartmentPositionBarChart.svelte";

    interface Faculty {
        department: string;
        rank: string;
        position: string;
        employmentType: string;
        retirementTrack: string;
        foreigner: string;
    }

    interface DepartmentCounts {
        department: string;
        count: number;
    }
    interface RankData {
        rank: string;
        count: number;
    }
    interface DepartmentRank {
        department: string;
        rankData: RankData[];
        // rankData: { rank: string; count: number }[];
    }

    interface DepartmentPosition {
        department: string;
        positionData: positionData[];
        // positionData: { position:string; count:number}[];
    }

    interface positionData {
        position: string;
        count: number;
    }

    // type RankData = {
    //     rank: string;
    //     count: number;
    // };

    let facultyList: Faculty[] = [];
    let tenureTrackFaculty: Faculty[] = [];
    let departmentCounts: DepartmentCounts[] = [];

    let rankEconomics: RankData[] = [];

    let departmentRank: DepartmentRank[] = [];

    let departmentPosition: DepartmentPosition[] = [];

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // async function getFaculty() {
    //     const response = await fetch("/api/faculty");
    //     const data = await response.json();
    //     console.log(JSON.stringify(data, null, 2));
    // }

    onMount(async () => {
        //spring-root 에서 가져옴
        // const response = await fetch(`${apiBaseUrl}/faculty`);

        //SvelteKit API endpoint 사용 http://localhost:3000/api/faculty
        const response = await fetch("/api/faculty");

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        // const data: {
        //     department: string;
        //     rank: string;
        //     position: string;
        //     employmentType: string;
        //     retirementTrack: string;
        //     foreigner: string;
        // }[] = await response.json();

        // // 데이터 추출 및 변환
        // facultyList = data.map((d) => ({
        //     department: d.department,
        //     rank: d.rank,
        //     position: d.position,
        //     employmentType: d.employmentType,
        //     retirementTrack: d.retirementTrack,
        //     foreigner: d.foreigner,
        // }));
        facultyList = await response.json();
        // console.log(JSON.stringify(facultyList, null, 2));

        tenureTrackFaculty = facultyList.filter(
            (faculty) => faculty.retirementTrack === "정년트랙",
        );

        departmentCounts = facultyList
            .filter((faculty) => faculty.employmentType === "전임교원") // 필터링
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

        rankEconomics = facultyList
            .filter(
                (faculty) =>
                    faculty.employmentType === "전임교원" &&
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
            }, [] as RankData[]);
        departmentRank = facultyList
            .filter(
                (item) =>
                    item.employmentType === "전임교원" &&
                    item.department !== "경상대학",
            )
            .reduce((acc: DepartmentRank[], faculty) => {
                let department = acc.find(
                    (dept) => dept.department === faculty.department,
                );

                if (!department) {
                    department = {
                        department: faculty.department,
                        rankData: [],
                    };
                    acc.push(department);
                }

                let rankData = department.rankData.find(
                    (rank) => rank.rank === faculty.rank,
                );

                if (!rankData) {
                    rankData = { rank: faculty.rank, count: 0 };
                    department.rankData.push(rankData);
                }

                rankData.count++;
                return acc;
            }, []);

        //console.log(JSON.stringify(departmentRank, null, 2));

        departmentPosition = facultyList
            .filter(
                (item) =>
                    // item.position !== "장학조교" &&
                    (item.position === "전임교원" ||
                        item.position === "겸임교수" ||
                        item.position === "강사") &&
                    item.department !== "경상대학",
            )
            .reduce((acc: DepartmentPosition[], faculty) => {
                let department = acc.find(
                    (dept) => dept.department === faculty.department,
                );

                if (!department) {
                    department = {
                        department: faculty.department,
                        positionData: [],
                    };
                    acc.push(department);
                }

                let positionData = department.positionData.find(
                    (d) => d.position === faculty.position,
                );

                if (!positionData) {
                    positionData = { position: faculty.position, count: 0 };
                    department.positionData.push(positionData);
                }

                positionData.count++;
                return acc;
            }, []);
        //console.log(JSON.stringify(departmentPosition, null, 2));
    });
</script>

<style>
    /* 기본 스타일 */
    :global(body) {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #1a1a1a;
        margin: 0;
        padding: 0;
    }

    /* 컨테이너 */
    .container {
        max-width: 1440px;
        margin: 0 auto;
        padding: 2rem;
    }

    /* 헤더 */
    h1 {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 2rem;
        color: #1a1a1a;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 1rem;
        color: #2a2a2a;
    }

    /* 차트 레이아웃 */
    .chart-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 600px), 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .chart {
        border-radius: 12px;
        padding: 1.5rem;
        background: transparent;
        transition: transform 0.2s ease;
    }

    .chart:hover {
        transform: translateY(-2px);
    }

    .responsive-svg-container {
        width: 100%;
        height: auto;
        min-height: 400px;
    }

    /* 미디어 쿼리 */
    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }

        h1 {
            font-size: 2rem;
        }

        .chart {
            padding: 1rem;
        }

        .responsive-svg-container {
            min-height: 300px;
        }
    }
</style>

<section class="w-full">
    <main class="container">
        <h1>경상대 교원현황</h1>
        <div class="chart-container">
            <div class="chart">
                <h2>학과(부)별 교원수</h2>
                <div class="responsive-svg-container">
                    <DepartmentPositionBarChart {departmentPosition} />
                </div>
            </div>
            <div class="chart">
                <h2>직급별 전임교원수</h2>
                <div class="responsive-svg-container">
                    <DepartmentRankArcChart {departmentRank} />
                </div>
            </div>
        </div>
    </main>
</section>