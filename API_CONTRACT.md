# API_CONTRACT.md
**Project:** Intelligent Document Query System using LLMs  
**Team:** Code Chill Repeat  

---

## 1. Core Features of the Application

1. **User Authentication**  
   - Users can log in to securely access the system.

2. **Document Upload & Management**  
   - Upload multiple document formats (PDF, Word, Email).  
   - View, list, and delete documents.

3. **Natural Language Query Submission**  
   - Submit plain-English questions.  
   - Handles vague or incomplete queries.

4. **Query Parsing**  
   - Extracts structured information from the query (age, procedure, location, policy duration).

5. **Semantic Retrieval**  
   - Searches documents for relevant clauses using embeddings and vector search.

6. **Decision Making**  
   - Returns approval/rejection with payout amount (if applicable).  
   - Justification is linked to specific clauses from documents.

7. **Response Generation**  
   - Outputs structured JSON with decision, amount, justification, and clause references.

8. **Audit & History**  
   - Stores past queries and decisions for transparency.

---

## 2. Data Models

### User
```json
{
  "id": "user_123",
  "username": "alice",
  "email": "alice@example.com",
  "role": "user",
  "created_at": "2025-08-12T14:30:00Z"
}
```

### Document
```json
{
  "id": "doc_123",
  "filename": "policy.pdf",
  "type": "pdf",
  "uploader_id": "user_123",
  "upload_date": "2025-08-12T14:30:00Z",
  "status": "processed"
}
```

### ParsedQuery
```json
{
  "age": 46,
  "gender": "M",
  "procedure": "knee surgery",
  "location": "Pune",
  "policy_duration_months": 3,
  "raw_text": "46M, knee surgery, Pune, 3-month policy"
}
```

### ClauseReference
```json
{
  "document_id": "doc_123",
  "clause_id": "clause_42",
  "text_snippet": "Clause 5.2.1 covers knee surgery...",
  "page": 7
}
```

### Decision
```json
{
  "id": "decision_123",
  "query_id": "query_456",
  "decision": "approved",
  "amount": 150000,
  "currency": "INR",
  "justification": "Clause 5.2.1 covers knee surgery after 3 months.",
  "clauses_referenced": [ /* ClauseReference objects */ ]
}
```

---

## 3. API Endpoints

### 3.1 Upload Document
- **Feature:** Upload a new document  
- **HTTP Method:** POST  
- **Endpoint Path:** `/api/documents/upload`  
- **Description:** Upload and process a document for semantic search.  
- **Request Body:** (multipart/form-data)
  - `file`: binary file  
  - `metadata` (optional): JSON string  
- **Success Response (201):**
```json
{
  "id": "doc_123",
  "filename": "policy.pdf",
  "type": "pdf",
  "upload_date": "2025-08-12T14:30:00Z",
  "status": "processing"
}
```
- **Error Responses:**
```json
{ "error": "Invalid file type." }
```
```json
{ "error": "Failed to process document." }
```

---

### 3.2 List Documents
- **Feature:** Get all uploaded documents  
- **HTTP Method:** GET  
- **Endpoint Path:** `/api/documents`  
- **Description:** Returns list of documents with metadata.  
- **Success Response (200):**
```json
[
  {
    "id": "doc_123",
    "filename": "policy.pdf",
    "type": "pdf",
    "upload_date": "2025-08-12T14:30:00Z"
  }
]
```
- **Error Response:**
```json
{ "error": "Unable to fetch documents." }
```

---

### 3.3 Delete Document
- **Feature:** Delete a document by ID  
- **HTTP Method:** DELETE  
- **Endpoint Path:** `/api/documents/{documentId}`  
- **Description:** Removes a document from the system.  
- **Success Response (200):**
```json
{ "message": "Document deleted successfully." }
```
- **Error Response:**
```json
{ "error": "Document not found." }
```

---

### 3.4 Submit Query
- **Feature:** Submit a query for processing  
- **HTTP Method:** POST  
- **Endpoint Path:** `/api/queries`  
- **Description:** Parses query, searches documents, and returns decision.  
- **Request Body:**
```json
{
  "raw_text": "46M, knee surgery, Pune, 3-month policy"
}
```
- **Success Response (200):**
```json
{
  "query": { /* Query object */ },
  "decision": { /* Decision object */ }
}
```
- **Error Response:**
```json
{ "error": "Invalid query text." }
```

---

### 3.5 Get Query Result
- **Feature:** Get a query result by ID  
- **HTTP Method:** GET  
- **Endpoint Path:** `/api/queries/{queryId}`  
- **Description:** Returns stored parsed query and decision.  
- **Success Response (200):**
```json
{
  "id": "query_456",
  "parsed_query": { /* ParsedQuery */ },
  "decision": { /* Decision */ }
}
```
- **Error Response:**
```json
{ "error": "Query not found." }
```

---

### 3.6 Semantic Search
- **Feature:** Search relevant clauses using semantic matching  
- **HTTP Method:** POST  
- **Endpoint Path:** `/api/search/semantic`  
- **Description:** Returns top matching clauses for a query.  
- **Request Body:**
```json
{
  "query": "knee surgery waiting period",
  "top_k": 5
}
```
- **Success Response (200):**
```json
{
  "results": [
    {
      "document_id": "doc_123",
      "clause_id": "clause_5_2_1",
      "text_snippet": "Clause 5.2.1 covers knee surgery...",
      "score": 0.93,
      "page": 7
    }
  ]
}
```
- **Error Response:**
```json
{ "error": "Search failed." }
```

---

### 3.7 Feedback on Decision
- **Feature:** Submit feedback on a decision  
- **HTTP Method:** POST  
- **Endpoint Path:** `/api/decisions/{decisionId}/feedback`  
- **Description:** Store reviewer feedback for audit/training.  
- **Request Body:**
```json
{
  "accepted": true,
  "notes": "Decision is correct."
}
```
- **Success Response (200):**
```json
{ "message": "Feedback saved." }
```
- **Error Response:**
```json
{ "error": "Decision not found." }
```

---
