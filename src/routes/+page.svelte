<script lang="ts">
    import { onMount } from "svelte";

    interface DepartmentCount {
        department: string;
        count: number;
    }

    interface Faculty {
        department: string;
        retirementTrack: string;
    }

    let departmentCounts: DepartmentCount[] = [];
    let jsonData: string = "";
    const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/faculty`;

    onMount(async () => {
        const response = await fetch(`${apiBaseUrl}`);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data: Faculty[] = await response.json();
        jsonData = JSON.stringify(data, null, 2);
        departmentCounts = data
            .filter(
                (faculty: Faculty) => faculty.retirementTrack === "정년트랙",
            )
            .reduce((acc: DepartmentCount[], faculty: Faculty) => {
                const existingDepartment = acc.find(
                    (item) => item.department === faculty.department,
                );
                if (existingDepartment) {
                    existingDepartment.count++;
                } else {
                    acc.push({ department: faculty.department, count: 1 });
                }
                return acc;
            }, []);
    });
</script>

<section class="w-full">
    <main class="container">
        <section class="section">
            <h4>프로젝트 개요</h4>

            <div class="section">
                <h2>프로젝트 배경</h2>
                <ul>
                    <li>
                        한양대학교 인사팀 주관 '2024 한양다움 휴리오' 학습조직
                        참여
                    </li>
                    <li>팀명: Just Do 'IT'</li>
                </ul>
            </div>

            <div class="section">
                <h2>팀 운영 목적</h2>
                <ul>
                    <li>업무 현장의 문제를 IT로 효율적으로 해결</li>
                    <li>협업을 통한 문제 해결 방식 도입</li>
                    <li>실무 포트폴리오 구축</li>
                    <li>프로젝트 수행 노하우 축적 및 공유</li>
                </ul>
            </div>

            <div class="section">
                <h2>기술 스택</h2>
                <ul>
                    <li>운영체제: Ubuntu, Nginx</li>
                    <li>Frontend: Svelte, TypeScript</li>
                    <li>Backend: Spring Boot, Python</li>
                    <li>Database: PostgreSQL</li>
                    <li>개발 언어: JavaScript</li>
                    <li>사용 라이브러리: SvelteKit, Tailwind CSS, D3, Plot, Vite</li>
                </ul>
            </div>

            <div class="section">
                <h2>프로젝트 특징</h2>
                <ul>
                    <li>
                        경상대 비즈니스 인텔리전스(BI) 시스템 프로토타입 개발
                    </li>
                    <li>교원/학생 데이터 활용 (민감정보 제외)</li>
                    <li>통계 목적 데이터 가공 및 활용</li>
                    <li>단계적 기능 확장 계획 수립</li>
                </ul>
            </div>
        </section>
        <section class="section">
            <h4>외부 API 연동 테스트 - 학과별 전임교원수</h4>
            <div>
                <ul>
                    {#each departmentCounts as item}
                        <li>{item.department} ({item.count})</li>
                    {/each}
                </ul>
                <div class="json-box">
                    <p>API URL: {apiBaseUrl}</p>
                    <!-- <pre>{jsonData}</pre> -->
                </div>
            </div>
        </section>
    </main>
</section>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    /* h1 {
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 10px;
        margin-bottom: 30px;
    } */
    h2 {
        color: #34495e;
        margin-top: 25px;
    }
    ul {
        list-style-type: none;
        padding-left: 0;
    }
    li {
        margin-bottom: 10px;
        padding-left: 20px;
        position: relative;
    }
    li:before {
        content: "•";
        color: #3498db;
        position: absolute;
        left: 0;
    }
    .section {
        margin-bottom: 30px;
    }
    .section {
        margin-bottom: 2rem;
    }
    .section h4 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
        color: #333;
    }
    .section p {
        font-size: 1rem;
        line-height: 1.6;
        color: #666;
    }
    .section ul {
        list-style-type: none;
        padding: 0;
    }
    .section li {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #333;
    }
    .json-box {
        background-color: #f9f9f9;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
        white-space: pre-wrap;
        font-family: monospace;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }
</style>
