const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Populating 'AI & Machine Learning' course...");

  const course = await prisma.course.findFirst({
    where: { title: "AI & Machine Learning" }
  });

  if (!course) {
    console.error("Could not find the course 'AI & Machine Learning'. Did it get deleted?");
    return;
  }

  // Clear existing modules to start fresh
  await prisma.module.deleteMany({
    where: { courseId: course.id }
  });

  // Module 1: Introduction to AI
  const module1 = await prisma.module.create({
    data: {
      title: "Module 1: Introduction to Artificial Intelligence",
      order: 1,
      courseId: course.id,
      lessons: {
        create: [
          {
            title: "What is AI?",
            content: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions.",
            videoUrl: "https://www.youtube.com/embed/ad79nYk2keg", // Dummy YouTube URL
            order: 1
          },
          {
            title: "History of Machine Learning",
            content: "Machine learning has a rich history dating back to the 1950s when Arthur Samuel created a program that played checkers.",
            videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU", 
            order: 2
          }
        ]
      }
    }
  });

  // Module 2: Deep Learning & Neural Networks
  const module2 = await prisma.module.create({
    data: {
      title: "Module 2: Deep Learning Foundations",
      order: 2,
      courseId: course.id,
      lessons: {
        create: [
          {
            title: "Understanding Neural Networks",
            content: "A neural network is a network or circuit of biological neurons, or, in a modern sense, an artificial neural network, composed of artificial neurons or nodes.",
            videoUrl: "https://www.youtube.com/embed/aircAruvnKk", // 3Blue1Brown NN
            order: 1
          },
          {
            title: "Backpropagation Explained",
            content: "Backpropagation is a method used in artificial neural networks to calculate a gradient that is needed in the calculation of the weights to be used in the network.",
            videoUrl: "https://www.youtube.com/embed/Ilg3gGewQ5U", // 3Blue1Brown
            order: 2
          },
          {
            title: "Course Project: Build an Image Classifier",
            content: "In this final lesson, you will use TensorFlow to build a simple Convolutional Neural Network (CNN) to classify images from the CIFAR-10 dataset.",
            fileType: "pdf",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Dummy PDF
            order: 3
          }
        ]
      }
    }
  });

  console.log("Successfully populated course with 2 modules and 5 lessons!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
