/**
 * Papyrus CLI - Review Commands
 */

import { getReviewQueue, getReviewStats, submitReview } from "../api.js";
import type { Card } from "../types.js";
import { formatRelativeTime, prompt, truncate } from "../utils.js";

/**
 * Display card for review
 */
function displayReviewCard(card: Card, index: number, total: number): void {
  console.clear();
  console.log(`\n📚 Review (${index + 1}/${total})\n`);
  console.log("─".repeat(60));
  console.log(`\nQ: ${card.q}\n`);
  console.log("─".repeat(60));
  console.log("\nPress Enter to reveal answer...\n");
}

/**
 * Display answer and rating options
 */
function displayAnswer(card: Card): void {
  console.log("\n" + "═".repeat(60));
  console.log(`\nA: ${card.a}\n`);
  console.log("═".repeat(60));
  console.log("\nRate your recall:");
  console.log("  [1] 忘记 - Complete blackout");
  console.log("  [2] 模糊 - Incorrect response, remembered");
  console.log("  [3] 秒杀 - Perfect response");
  console.log("  [q] Quit review session\n");
}

/**
 * Interactive review session
 */
export async function reviewCommand(): Promise<void> {
  const queue = await getReviewQueue();
  
  if (queue.length === 0) {
    console.log("\n🎉 No cards are due for review!");
    console.log("   Great job keeping up with your studies.");
    return;
  }
  
  console.log(`\n📚 Starting review session with ${queue.length} card(s)...\n`);
  
  let completed = 0;
  let skipped = 0;
  
  for (let i = 0; i < queue.length; i++) {
    const card = queue[i]!;
    
    displayReviewCard(card, i, queue.length);
    
    // Wait for Enter to reveal
    await prompt("");
    
    displayAnswer(card);
    
    // Get rating
    let validInput = false;
    while (!validInput) {
      const input = await prompt("Your rating: ");
      
      if (input.toLowerCase() === "q") {
        console.log("\n👋 Review session ended.");
        console.log(`   Completed: ${completed}, Skipped: ${skipped + queue.length - i}`);
        return;
      }
      
      const grade = parseInt(input, 10);
      
      // Papyrus uses grades 1-3: 1=忘记, 2=模糊, 3=秒杀
      if (grade >= 1 && grade <= 3) {
        try {
          await submitReview(card.id, grade);
          completed++;
          validInput = true;
          
          // Show feedback
          const feedback = grade === 1 
            ? "😔 Don't worry, you'll get it next time!" 
            : grade === 2 
            ? "😐 Keep practicing!" 
            : "🌟 Excellent!";
          
          console.log(`\n   ${feedback}`);
          await new Promise(r => setTimeout(r, 1000));
          
        } catch (error) {
          console.error(`\n   Error submitting review: ${error}`);
        }
      } else {
        console.log("   Please enter 1-3 or q to quit.");
      }
    }
  }
  
  console.log("\n🎉 Review session complete!");
  console.log(`   You reviewed ${completed} card(s).`);
  console.log("   Keep up the great work!\n");
}

/**
 * Quick review (non-interactive)
 */
export async function quickReviewCommand(): Promise<void> {
  const stats = await getReviewStats();
  
  console.log("\n📊 Review Statistics\n");
  console.log(`  Total Cards: ${stats.stats.total_cards}`);
  console.log(`  Due Today: ${stats.stats.due_today}`);
  console.log(`  New Cards: ${stats.stats.new_cards}`);
  console.log(`  Review Cards: ${stats.stats.review_cards}`);
  
  if (stats.stats.due_today > 0) {
    console.log(`\n💡 Run 'papyrus review' to start your review session.`);
  } else {
    console.log("\n🎉 You're all caught up!");
  }
}

/**
 * Review stats command
 */
export async function reviewStatsCommand(): Promise<void> {
  const stats = await getReviewStats();
  
  console.log("\n📊 Review Statistics\n");
  console.log(`  Total Cards: ${stats.stats.total_cards}`);
  console.log(`  Due Today: ${stats.stats.due_today}`);
  console.log(`  New Cards: ${stats.stats.new_cards}`);
  console.log(`  Review Cards: ${stats.stats.review_cards}`);
  
  // Get queue for more details
  const queue = await getReviewQueue();
  
  if (queue.length > 0) {
    console.log(`\n📚 Next ${Math.min(5, queue.length)} cards due:\n`);
    
    for (let i = 0; i < Math.min(5, queue.length); i++) {
      const card = queue[i]!;
      console.log(`  ${i + 1}. ${truncate(card.q, 45)}`);
      console.log(`     Due: ${formatRelativeTime(card.next_review)}`);
    }
    
    if (queue.length > 5) {
      console.log(`\n  ... and ${queue.length - 5} more`);
    }
  }
}
