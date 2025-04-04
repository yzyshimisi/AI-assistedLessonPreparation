interface KnowledgeGraphType{
    nodes: Array<{id: string, text: string}>,
    lines: Array<{from: string, to: string}>
}