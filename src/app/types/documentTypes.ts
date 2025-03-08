export interface KeyDate {
    date: string;
    context: string;
  }
  
  export interface DocumentReference {
    text: string;
    location: string;
  }
  
  export interface DocumentSummaryType {
    document_type: string;
    parties_involved: string[];
    key_dates: KeyDate[];
    primary_subjects: string[];
    key_provisions: string[];
    critical_obligations: string[];
    potential_issues: string[];
    summary: string;
  }
  
  export interface DocumentQueryResponse {
    id?: string;
    timestamp?: string;
    queryText?: string;
    direct_references: DocumentReference[];
    interpretation: string;
    related_principles: string[];
    strategic_insights: string[];
    limitations: string[];
    recommended_actions: string[];
  }