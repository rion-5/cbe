import { query } from '$lib/db';

export const GET = async () => {
    const faculty = await query(`
        SELECT
            CASE WHEN 학과 = '' THEN '경상대학' ELSE 학과 END AS department,
            직급 AS rank,
            직종 AS position,
            정년트랙구분 AS retirementtrack,
            외국인여부 AS foreigner
        FROM 교원조회및인사카드출력
        WHERE 대학 = '경상대학' AND 재직구분 = '재직'
    `);

    // Assuming 'query' returns an array of objects
    const formattedFaculty = faculty.map((item: any) => ({
        department: item.department,
        rank: item.rank,
        position: item.position,
        retirementTrack: item.retirementtrack,
        foreigner: item.foreigner
    }));
    
    console.log(JSON.stringify(formattedFaculty, null, 2));
    return new Response(JSON.stringify(formattedFaculty), { status: 200 });
};
