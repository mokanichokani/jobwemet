import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://codesignal.com/wp-content/uploads/2023/02/elastic-logo@2x.svg",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://codesignal.com/wp-content/uploads/2023/02/instacart-logo@2x.svg",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://codesignal.com/wp-content/uploads/2023/02/reddit-logo@2x.svg",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://codesignal.com/wp-content/uploads/2023/02/brex-logo@2x.svg",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://codesignal.com/wp-content/uploads/2023/02/asana-logo@2x.svg",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://codesignal.com/wp-content/uploads/2023/02/asana-logo@2x.svg",
  },
];

const firstRow = reviews.slice(0, reviews.length

);


const ReviewCard = ({
  img,

}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl  p-4",
        // light styles
        " bg-gray-50/[.01] "
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="" width="100" height="100" alt="" src={img} />
      </div>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
  );
}
