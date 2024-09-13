<script lang="ts">
    import { onMount } from "svelte";
    import DepartmentCountsBarChart from "./DepartmentCountsBarChart.svelte";
    import RankArcChart from "./RankArcChart.svelte";
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
                    item.position !== "장학조교" &&
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

<section class="w-full">
    <main class="container mx-auto px-4 md:px-6 py-8">
        <section class="mb-8">
            <div class="container">
                <h1>경상대 교원현황</h1>
                <div class="row">
                    <!-- <div>
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
        </div> -->
                    <div>
                        <h2>학부별 교원구성</h2>
                        <div class="responsive-svg-container">
                            <DepartmentPositionBarChart {departmentPosition} />
                        </div>
                    </div>
                    <div>
                        <h2>학부별 전임교원구성</h2>
                        <div class="responsive-svg-container">
                            <DepartmentRankArcChart {departmentRank} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</section>

<!-- {#each departmentRank as item}
    <li>
        학과: {item.department} 
    </li>
{/each} -->

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style>
