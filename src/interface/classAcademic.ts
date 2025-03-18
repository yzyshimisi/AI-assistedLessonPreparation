interface studentInfoType{
    student_id: string,
    name: string,
    class: string,
    major: string,
    college: string,
    regular_score: string,
    final_score: string,
    total_score: string,
    credit_earned: boolean,
    grade_point: number,
}

interface updateScoreType{
    student_id: string,
    name: string,
    class: string,
    major: string,
    college: string,
    regular_score: string,
    final_score: string,
    total_score: string
}

interface addScoreType{
    student_id: string,
    regular_score: string,
    final_score: string,
    total_score: string
}