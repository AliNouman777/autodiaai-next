import type { ExamplePrompt } from "@/components/common/ExamplePromptBox";

/* ---------------- Example prompts (same style as Aside) ---------------- */
export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    title: "E-commerce Platform",
    description: "Online store with products, orders, and customers",
    prompt:
      "Create an e-commerce system with Users, Products, Orders, Categories, Shopping Cart, Payment Methods, and Customer Reviews. Include relationships for order management and inventory tracking.",
  },
  {
    title: "Blog Platform",
    description: "Content management with authors and comments",
    prompt:
      "Design a blog platform with Authors, Posts, Comments, Tags, Categories, and Media Files. Include user authentication, post scheduling, and comment moderation features.",
  },
  {
    title: "University System",
    description: "Academic management with courses and students",
    prompt:
      "Build a university system with Students, Professors, Courses, Enrollments, Departments, Grades, and Schedules. Include semester management and prerequisite tracking.",
  },
  {
    title: "Social Media",
    description: "Social network with posts and connections",
    prompt:
      "Create a social media platform with Users, Posts, Comments, Likes, Followers, Messages, and Groups. Include privacy settings and content moderation.",
  },
  {
    title: "Project Management",
    description: "Task tracking with teams and deadlines",
    prompt:
      "Design a project management tool with Projects, Tasks, Users, Teams, Time Tracking, and Milestones. Include task dependencies and progress reporting.",
  },
];
