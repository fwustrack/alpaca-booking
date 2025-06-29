export interface Animal {
  id: string;
  name: string;
  description?: string;
  teaser?: string;
  sponsorshipAvailable: boolean;
  hasCurrentSponsorship: boolean;
  sponsorName?: string;
  sponsorCustomText?: string;
}
