import { Router } from "express";
import {
  createCategory,
  createDisease,
  deleteDisease,
  getAllDiseaseCategories,
  getCategoryAdmin,
  getDiseasesAdmin,
  updateDisease,
} from "../controllers/diseases.controllers";

const router = Router();

router.post("/", createDisease as any);
router.post("/category", createCategory as any);
router.get("/", getAllDiseaseCategories as any);
router.get("/admin-diseases", getDiseasesAdmin as any);
router.get("/admin-category", getCategoryAdmin as any);
router.put("/:id", updateDisease as any);
router.delete("/:id", deleteDisease as any);

export default router;

