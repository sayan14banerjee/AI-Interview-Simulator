import faiss 
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

vector_store = {}
text_store = {}

def create_embeddings(text_chunks, user_id):
    embeddings = model.encode(text_chunks)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))
    vector_store[user_id] = index
    text_store[user_id] = text_chunks

def retrieve_context(query, user_id, top_k=5):
    if user_id not in vector_store:
        return []
    
    query_embedding = model.encode([query])
    index = vector_store[user_id]
    distances, indices = index.search(np.array(query_embedding), top_k)
    
    chunks = text_store[user_id]
    return [chunks[i] for i in indices[0] if i < len(chunks)]
