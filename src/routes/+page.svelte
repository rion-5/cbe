<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    interface Faculty {
        department: string;
        rank: string;
        retirementTrack: string;
        foreigner: string;
    }

    let facultyList: Faculty[] = [];
    let tenureTrackFaculty: Faculty[]  = [];
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
        console.log(facultyList);
        tenureTrackFaculty = data.filter(faculty => faculty.retirementTrack === "정년트랙");

        console.log(tenureTrackFaculty);
        
    });
</script>
{#each facultyList as item}
	<li>
		학과: {item.department}  직급: {item.rank} 정년트랙: {item.retirementTrack}
	</li>
{/each}
