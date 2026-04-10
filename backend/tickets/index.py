"""API для управления билетами на концерт KOMAR"""
import json
import os
import psycopg2

SCHEMA = "t_p28444642_rap_concert_ticketin"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")

    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, row_num, seat_num, zone, price, is_taken FROM {SCHEMA}.seats ORDER BY row_num, seat_num")
        rows = cur.fetchall()
        conn.close()
        seats = [{"id": r[0], "row": r[1], "seat": r[2], "zone": r[3], "price": r[4], "taken": r[5]} for r in rows]
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"seats": seats})}

    if method == "POST" and "/buy" in path:
        body = json.loads(event.get("body") or "{}")
        seat_ids = body.get("seat_ids", [])
        if not seat_ids:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "seat_ids required"})}

        conn = get_conn()
        cur = conn.cursor()
        placeholders = ",".join(["%s"] * len(seat_ids))
        cur.execute(f"SELECT id FROM {SCHEMA}.seats WHERE id IN ({placeholders}) AND is_taken = TRUE", seat_ids)
        already_taken = cur.fetchall()
        if already_taken:
            conn.close()
            return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Некоторые места уже заняты"})}

        cur.execute(f"UPDATE {SCHEMA}.seats SET is_taken = TRUE, taken_at = NOW() WHERE id IN ({placeholders})", seat_ids)
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True, "bought": len(seat_ids)})}

    return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}