import { query } from '$lib/db';

export const GET = async ({ url }: { url: URL }) => {
    // URLSearchParams를 통해 쿼리 파라미터 'term' 값 가져오기
    const term = url.searchParams.get('term');

    const academic = await query(`
        select 학과 department, 국적 nationality, 학적상태 academicstatus from 학적대장조회내역
        where 학기 = 202402
        ORDER BY array_position(ARRAY['경제학부','경영학부','보험계리학과','회계세무학과'], 학과::text),
        array_position(ARRAY['대한민국','중국'], 국적::text), 학적상태 
    `);

    // Assuming 'query' returns an array of objects
    const formattedAcademic = academic.map((item: any) => ({
        department: item.department,
        nationality: item.nationality,
        academicstatus: item.academicstatus,
        term: term

    }));

    // const academic = await query(`
    //     select 학과 department, 국적 nationality, count(*) count from 학적대장조회내역
    //     where 학적상태 ='재학생'
    //     and 학기 = '${term}'
    //     and 국적<>'대한민국'
    //     group by 학과, 국적
    //     ORDER BY array_position(ARRAY['경제학부','경영학부','보험계리학과','회계세무학과'], 학과::text), count(*) DESC
    // `);

    // // Assuming 'query' returns an array of objects
    // const formattedAcademic = academic.map((item: any) => ({
    //     department: item.department,
    //     nationality: item.nationality,
    //     count: item.count,
    //     term: term

    // }));
    // console.log(JSON.stringify(formattedFaculty, null, 2));
    return new Response(JSON.stringify(formattedAcademic), { status: 200 });
};
