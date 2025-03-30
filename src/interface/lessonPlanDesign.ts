interface createLessonPlanInfoType{
    textbook_name: string,
    subject: string,
    total_hours: string,
    topic_name: string,
    template_file: string,
    resource_file: string,
    textbook_img: string,
    description: string,
    session_id: number,
}

interface modifyLessonPlanInfoType{
    description: string,
    message_id: number,
    resource_file: string,
    subject: string,
    template_file: string,
    textbook_img: string,
    textbook_name: string,
    topic_name: string,
    total_hours: string,
    tplan_content: string,
    tplan_url: string,
}