import fs from "fs";

const dataPath = "./data/lessons_export.json";

const lessons = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const updated = lessons.map(lesson => {
  lesson.space = 5;
  return lesson;
});

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), "utf-8");

console.log(" All lesson space reset to 5.");
