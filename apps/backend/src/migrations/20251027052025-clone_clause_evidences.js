/**
 * Migration: Clone evidences from controlstatuses to controlevidences
 */
module.exports = {
  async up(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const controlStatuses = await db
          .collection("controlstatuses")
          .find({})
          .toArray();

        const controlevidencesCollection = db.collection("controlevidences");

        for (const controlStatus of controlStatuses) {
          if (controlStatus?.evidences?.length === 0) {
            continue;
          }

          for (const evidence of controlStatus?.evidences) {
            const newDoc = {
              evidenceType: "raw-file",
              controlStatusId: controlStatus?._id,
              fileStorage: {
                Key: evidence?.Key || evidence?.key,
                Name: evidence?.Name,
                Bucket: evidence?.Bucket,
                key: evidence?.key,
              },
              organization: controlStatus?.organization,
              createdAt: controlStatus?.createdAt,
              updatedAt: controlStatus?.updatedAt,
            };

            await controlevidencesCollection.insertOne(newDoc, { session });
          }
        }
      });

      console.log(
        "Migration completed successfully for cloning clause evidence"
      );
    } catch (err) {
      console.error("Migration failed:", err);
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  },

  async down(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection("controlevidences").deleteMany({}, { session });
      });
      console.log(
        "Rollback completed successfully for cloning clause evidence"
      );
    } catch (err) {
      console.error("Rollback failed:", err);
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  },
};
