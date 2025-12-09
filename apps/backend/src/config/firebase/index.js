const admin = require("firebase-admin");
const serviceAccount = require("./ims-systems-00-firebase-adminsdk-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
/**
 *
 * @returns {import('firebase-admin')} - this returns a fire base admin object.
 */
function getFirebaseAdmin() {
  return admin;
}
exports.getFirebaseAdmin = getFirebaseAdmin;
