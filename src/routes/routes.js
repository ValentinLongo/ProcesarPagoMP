import { Router } from "express";
import { crearOrden, notificarOrden } from "../controllers/mercaControllers.js";

const router = Router();

router.post('/crear-orden', crearOrden);
router.post('/notificacion', notificarOrden);

export default router;