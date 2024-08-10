<script lang="ts">
    import { onMount } from "svelte";
    import DepartmentCountsBarChart from "./DepartmentCountsBarChart.svelte";
    import RankArcChart from "./RankArcChart.svelte";
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

    let facultyList: Faculty[] = [];
    let tenureTrackFaculty: Faculty[] = [];
    let departmentCounts: DepartmentCounts[] = [];

    let rankEconomics: ProfessorRank[] = [];
    let rankBusiness: ProfessorRank[] = [];
    let rankActuarial: ProfessorRank[] = [];
    let rankAccounting: ProfessorRank[] = [];

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
        // console.log(facultyList);
        tenureTrackFaculty = data.filter(
            (faculty) => faculty.retirementTrack === "정년트랙",
        );

        departmentCounts = data
            .filter((faculty) => faculty.retirementTrack === "정년트랙") // 필터링
            .reduce(
                (acc, faculty) => {
                    const existingDepartment = acc.find((item) => item.department === faculty.department);
                    if (existingDepartment) {
                        existingDepartment.count++;
                    } else {
                        acc.push({ department: faculty.department, count: 1 });
                    }
                    return acc;
                },
                [] as DepartmentCounts[],
            );

        //console.log(JSON.stringify(departmentCounts, null, 2));

        rankEconomics = data.filter((faculty) => (faculty.retirementTrack ==="정년트랙"
         && faculty.department === "경제학부"))
         .reduce(
                (acc, faculty) => {
                    const existingRank = acc.find((item) => item.rank === faculty.rank);
                    if (existingRank) {
                        existingRank.count++;
                    } else {
                        acc.push({ rank: faculty.rank, count: 1 });
                    }
                    return acc;
                },
                [] as ProfessorRank[],
        
        );
        // console.log(JSON.stringify(rankEconomics, null, 2));
        rankBusiness = data.filter((faculty) => (faculty.retirementTrack ==="정년트랙"
         && faculty.department === "경영학부"))
         .reduce(
                (acc, faculty) => {
                    const existingRank = acc.find((item) => item.rank === faculty.rank);
                    if (existingRank) {
                        existingRank.count++;
                    } else {
                        acc.push({ rank: faculty.rank, count: 1 });
                    }
                    return acc;
                },
                [] as ProfessorRank[],
        
        );
        rankActuarial = data.filter((faculty) => (faculty.retirementTrack ==="정년트랙"
         && faculty.department === "보험계리학과"))
         .reduce(
                (acc, faculty) => {
                    const existingRank = acc.find((item) => item.rank === faculty.rank);
                    if (existingRank) {
                        existingRank.count++;
                    } else {
                        acc.push({ rank: faculty.rank, count: 1 });
                    }
                    return acc;
                },
                [] as ProfessorRank[],
        
        );
        rankAccounting = data.filter((faculty) => (faculty.retirementTrack ==="정년트랙"
         && faculty.department === "회계세무학과"))
         .reduce(
                (acc, faculty) => {
                    const existingRank = acc.find((item) => item.rank === faculty.rank);
                    if (existingRank) {
                        existingRank.count++;
                    } else {
                        acc.push({ rank: faculty.rank, count: 1 });
                    }
                    return acc;
                },
                [] as ProfessorRank[],
        
        );

    });
</script>
<div class="container">
	<h1>경상대 교원현황</h1>
	<div class="row">
		<div class="col col-3">
			<h2>전임교원</h2>
			<div class="responsive-svg-container">
				<DepartmentCountsBarChart {departmentCounts} />
			</div>
		</div>
        <div class="col col-3">
			<h2>경제학부</h2>
			<div class="responsive-svg-container">
				<RankArcChart {rankEconomics} />
			</div>
		</div>
        <!-- <div class="col col-3">
			<h2>경영학부</h2>
			<div class="responsive-svg-container">
				<RankArcChart {rankBusiness} />
			</div>
		</div> -->
    <!--    <div class="col col-3">
			<h2>보험계리학과</h2>
			<div class="responsive-svg-container">
				<RankArcChart {rankActuarial} />
			</div>
		</div>
        <div class="col col-3">
			<h2>회계세무학과</h2>
			<div class="responsive-svg-container">
				<RankArcChart {rankAccounting} />
			</div>
		</div> -->
	</div>
</div>


<!-- {#each departmentCounts as item}
    <li>
        학과: {item.department} 교원수: {item.count}
    </li>
{/each} -->


<!-- {#each facultyList as item}
    <li>
        학과: {item.department} 직급: {item.rank} 정년트랙: {item.retirementTrack}
    </li>
{/each} -->
