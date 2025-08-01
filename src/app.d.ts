// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  interface ImageFile {
    sources: {
      avif: string;
      webp: string;
      png: string;
    };
    img: {
      src: string;
      w: number;
      h: number;
    };
  }
  interface Window {
    dataLayer: Record<string, any>[];
    'ga-disable-G-LLGRDWVVEV': boolean;
  }
  namespace Blog {
    interface HeadingBlock {
      type: 'heading';
      size: 1 | 2 | 3;
      content: string;
    }

    interface ImageBlock {
      type: 'image';
      align?: 'left' | 'right';
      size?: {
        width?: number;
        height?: number;
      };
      src: string;
      altText: string;
      caption?: string;
    }

    interface TextBlock {
      type: 'text';
      content: string;
    }

    interface YoutubeBlock {
      type: 'youtube';
      source: string;
      size?: {
        width?: number;
        height?: number;
      };
    }

    interface BylineBlock {
      type: 'byline';
      name: string;
      imageSrc: string;
      date: string;
    }

    type BlogBlock = HeadingBlock | ImageBlock | TextBlock | YoutubeBlock | BylineBlock;

    interface BlogPost {
      title: string;
      slug: string;
      previewImg?: ImageBlock;
      blocks: BlogBlock[];
      summary: string;
    }
  }

  namespace Help {
    interface Faq {
      question: string;
      answer: string;
    }
  }

  namespace BlendLibrary {
    interface Section {
      title: string;
      items: Item[];
    }
    interface Item {
      type: 'deck' | 'playlist';
      name: string;
      id: string;
      image: ImageFile;
      description?: string;
      author?: string;
    }
  }

  namespace Database {
    interface Deck {
      created_ts: string;
      modified_ts: string;
      is_editable: boolean;
      name: string;
      position: number;
      refId: number;
    }

    namespace AdminData {
      interface OrganizationNotes {
        [orgId: string]: string;
      }
    }

    interface Playlist {
      linked_deck_id: number;
      created_ts: string;
      modified_ts: string;
      is_editable: boolean;
      name: string;
      position: number;
      refId: number;
      words?: (string | false)[][];
    }
    interface OrganizationPlaylist {
      author?: string;
      originalRefId?: string;
      playlist: Playlist;
    }
    interface OrganizationDeck {
      author?: string;
      originalRefId?: string;
      deck: Deck;
    }
    namespace Decks {
      interface Organization {
        [deckId: string]: OrganizationDeck;
      }
      interface User {
        [deckId: string]: Deck;
      }
      interface Preloaded {
        [deckId: string]: Deck;
      }
    }
    namespace Playlists {
      interface Organization {
        [playlistId: string]: OrganizationPlaylist;
      }
      interface User {
        [playlistId: string]: Playlist;
      }
      interface Preloaded {
        [playlistId: string]: Playlist;
      }
      interface Library {
        [playlistId: string]: Playlist;
      }
    }
    namespace Invite {
      interface Organization {
        orgId: string;
        inviteeEmail: string;
        inviteeUid?: string;
        emailSentTs?: number;
      }
      interface InviteDetails extends Organization {
        id: string;
        displayName?: string;
      }
      interface Validation {
        email: string;
        name?: string;
        uid?: string;
        status?: string;
        error?: boolean;
        validated?: boolean;
      }
    }

    namespace Organization {
      interface Member {
        role: 'admin' | 'member';
      }
      interface MemberDetails extends Member {
        displayName: string;
        email: string;
        uid: string;
      }

      interface InviteRequest {
        timestamp: number;
        message?: string;
      }

      interface Public {
        name: string;
        contactEmail?: string;
        logoUrl?: string;
      }
      // Private fields can be seen and edited by org admins
      interface Private {
        members?: {
          [uid: string]: Member;
        };
        invites?: string[];
        inviteRequests?: {
          [uid: string]: Nullable<InviteRequest>;
        };
      }
      // Locked fields can be seen by org admins but only edited by Blend admins
      interface Locked {
        active: boolean;
        seats: number;
        termEnd?: number;
        termStart?: number;
        isLicensed?: boolean; // This means the org is paying for member subscriptions. If false, the org is a Team and members provide their own subscriptions.
      }
    }

    interface Partners {
      [partnerId: string]: Partner;
    }

    interface Partner {
      public: {
        displayName: string;
        socialUrl: string;
        stripePromoCodeId?: string;
        logoUrl?: string;
        urlSlug?: string;
        blendMessage: string;
        partnerMessage?: string;
      };
      locked?: {
        redemptions?: {
          [uid: string]: Partner.Redemption;
        };
      };
    }

    namespace Partner {
      interface Redemption {
        checkoutTimestamp: number;
        convertedAfterTrial: boolean;
        subscriptionId: string;
        firstPaymentAmount?: number;
        partnerOwedAmount?: number;
        paymentDistributedToPartner?: boolean;
      }
    }
    interface Organization {
      public: Organization.Public;
      private?: Organization.Private;
      locked: Organization.Locked;
    }

    namespace User {
      interface Protected {
        isSubscribedToBlendPro: boolean;
        organizations?: string[];
      }
      interface Private {
        stripeCustomerId?: string;
      }
    }
    interface User {
      protected: User.Protected;
      private: User.Private;
    }
  }
}

export {};
