import { getDb, schema } from "@/lib/db"

export async function audit(
  userId: string | null,
  action: string,
  entity?: string,
  entityId?: string,
  detail?: Record<string, unknown>
): Promise<void> {
  const db = await getDb()
  await db.insert(schema.auditLogs).values({ userId, action, entity, entityId, detail })
}
