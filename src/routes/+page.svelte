<script lang="ts">
    import { onMount } from "svelte";
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

        const data: Faculty[] = await response.json();

        facultyList = data.map((d) => ({
            department: d.department,
            rank: d.rank,
            retirementTrack: d.retirementTrack,
            foreigner: d.foreigner,
        }));

        tenureTrackFaculty = data.filter(
            (faculty) => faculty.retirementTrack === "정년트랙",
        );

        departmentCounts = data
            .filter((faculty) => faculty.retirementTrack === "정년트랙")
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
    });
</script>

<section class="w-full">
    <main class="container mx-auto px-4 md:px-6 py-8">
        <section class="mb-8">
            <h4>Hello, CBE!</h4>
            <div>
                {#each departmentCounts as item}
                    <li>학과: {item.department}</li>
                {/each}
            </div>
        </section>
    </main>
</section>
