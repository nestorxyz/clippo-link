import { SOCIAL_PLATFORMS } from '@/lib/social-platforms';

const SocialMediaPlaceholders = () => {
  return (
    <div className="flex-1 w-full bg-[#111111] overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <h3 className="text-gray-400 text-sm font-medium mb-4 uppercase text-center">
          Popular Platforms
        </h3>
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {SOCIAL_PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-[4/3] rounded-2xl ${platform.color} p-4 flex items-center justify-center transition-transform hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                {platform.icon}
              </div>
            </a>
          ))}
        </div>
        <p className="text-center text-gray-400 mt-4">
          Get started by going to your favorite social media platform and
          sharing your link with us!
        </p>
      </div>
    </div>
  );
};

export default SocialMediaPlaceholders;
