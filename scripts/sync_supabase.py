import json
import os
import psycopg2

DB_URL = "postgresql://postgres.pvrztlydhqblvktprija:Arjin.0665.@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print("Connecting to Supabase PostgreSQL at aws-1-eu-west-1.pooler.supabase.com...")
    
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    # Query current count
    cur.execute("SELECT count(*) FROM categories;")
    cat_count = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM products;")
    prod_count = cur.fetchone()[0]

    print("==================================================")
    print("KATMERİM KÜNEFE & CAFE - SUPABASE VERİTABANI DURUMU")
    print(f"Aktif Kategori Sayısı : {cat_count}")
    print(f"Aktif Ürün Sayısı     : {prod_count}")
    print(f"Supabase Proje Adresi : https://pvrztlydhqblvktprija.supabase.co")
    print("==================================================")

    conn.close()

if __name__ == "__main__":
    main()
