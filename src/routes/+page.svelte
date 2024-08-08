<script lang="ts">
    import { onMount } from "svelte";
    import DepartmentCounts from "./DepartmentCounts.svelte";
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

    let facultyList: Faculty[] = [];
    let tenureTrackFaculty: Faculty[] = [];
    let departmentCounts: DepartmentCounts[] = [];

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

        console.log(JSON.stringify(departmentCounts, null, 2));
    });
</script>

<DepartmentCounts {departmentCounts} />

{#each departmentCounts as item}
    <li>
        학과: {item.department} 교원수: {item.count}
    </li>
{/each}


<!-- {#each facultyList as item}
    <li>
        학과: {item.department} 직급: {item.rank} 정년트랙: {item.retirementTrack}
    </li>
{/each} -->
