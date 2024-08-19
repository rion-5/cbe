import { query } from '$lib/db';

export const GET = async () => {
    const faculty = await query(`
        SELECT
            CASE WHEN 학과 = '' THEN '경상대학' ELSE 학과 END AS department,
            직급 AS rank,
            직종 AS position,
            전임구분 AS employmenttype,
            정년트랙구분 AS retirementtrack,
            외국인여부 AS foreigner
        FROM 교원조회및인사카드출력
        WHERE 대학 = '경상대학' AND 재직구분 = '재직'
        ORDER BY array_position(ARRAY['경영학부','경제학부','보험계리학과','회계세무학과'], 학과::text),
                array_position(ARRAY['전임교원','겸임교수','강사','명예교수'], 직종::text)
    `);

    // Assuming 'query' returns an array of objects
    const formattedFaculty = faculty.map((item: any) => ({
        department: item.department,
        rank: item.rank,
        position: item.position,
        employmentType: item.employmenttype,
        retirementTrack: item.retirementtrack,
        foreigner: item.foreigner
    }));
    
    // console.log(JSON.stringify(formattedFaculty, null, 2));
    return new Response(JSON.stringify(formattedFaculty), { status: 200 });
};
