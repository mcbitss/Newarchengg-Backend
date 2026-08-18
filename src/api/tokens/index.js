import { Router } from "express";
import { token } from "../../services/passport";
import {
  closeToken,
  getBusinessInvitations,
  getDoctorInvitations,
  getPartnerUserInvitations,
  getPatientInvitations,
  validateToken
} from "./controller";

const router = new Router();

router.put("/closeToken/:token", closeToken);

router.get("/validate-token/:token", validateToken);

router.get("/patient-invitations", token(), getPatientInvitations);

router.get("/doctor-invitations", token(), getDoctorInvitations);

router.get("/business-invitations", token(), getBusinessInvitations);

router.get("/partner-user-invitations", token(), getPartnerUserInvitations);

export default router;
