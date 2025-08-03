// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CollabContentPlatform {
    address public superadmin;

    struct Theme {
        uint256 id;
        string ipfsUrl;
        address creator;
        uint256 tips;
        string contentType;
        uint256 dateCreated;
        uint256 collaborators;
        uint256 maxCollaborators;
        address[] allCollaborators;
    }

    struct Contribution {
        uint256 id;
        uint256 themeId;
        address creator;
        uint256 dateCreated;
        string ipfsLink;
        bool approved;
    }

    mapping(address => bool) public isAdmin;
    mapping(uint256 => Theme) public themes;
    mapping(uint256 => Contribution) public contributions;
    mapping(address => mapping(uint256 => uint256)) public collaboratorThemeEarnings;

    uint256 public nextThemeId = 1;
    uint256 public nextContributionId = 1;

    event AdminAdded(address indexed admin);
    event ThemeCreated(uint256 indexed themeId, address indexed creator);
    event ContributionSubmitted(uint256 indexed contributionId, uint256 indexed themeId);
    event ContributionApproved(uint256 indexed contributionId);
    event ContributionRevoked(uint256 indexed contributionId);
    event TipReceived(uint256 indexed themeId, uint256 amount, uint256 perContributor);

    modifier onlySuperAdmin() {
        require(msg.sender == superadmin, "Not superadmin");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not admin");
        _;
    }

    constructor() {
        superadmin = msg.sender;
        isAdmin[msg.sender] = true;
    }

    function addAdmin(address admin) external onlySuperAdmin {
        require(admin != address(0), "Invalid address");
        isAdmin[admin] = true;
        emit AdminAdded(admin);
    }

    function createTheme(string memory ipfsUrl, string memory contentType, uint256 maxCollaborators) external onlyAdmin {
        require(maxCollaborators > 0, "Must allow at least 1 collaborator");

        Theme storage t = themes[nextThemeId];
        t.id = nextThemeId;
        t.ipfsUrl = ipfsUrl;
        t.creator = msg.sender;
        t.contentType = contentType;
        t.dateCreated = block.timestamp;
        t.maxCollaborators = maxCollaborators;

        emit ThemeCreated(nextThemeId, msg.sender);
        nextThemeId++;
    }

    function contribute(uint256 themeId, string memory ipfsLink) external {
        Theme storage t = themes[themeId];
        require(bytes(t.ipfsUrl).length > 0, "Theme does not exist");

        Contribution storage c = contributions[nextContributionId];
        c.id = nextContributionId;
        c.themeId = themeId;
        c.creator = msg.sender;
        c.ipfsLink = ipfsLink;
        c.dateCreated = block.timestamp;
        c.approved = false;

        emit ContributionSubmitted(nextContributionId, themeId);
        nextContributionId++;
    }

    function approveContribution(uint256 contributionId) external onlyAdmin {
        Contribution storage c = contributions[contributionId];
        require(!c.approved, "Already approved");

        Theme storage t = themes[c.themeId];
        require(t.collaborators < t.maxCollaborators, "Max collaborators reached");

        c.approved = true;
        t.collaborators++;
        t.allCollaborators.push(c.creator);

        emit ContributionApproved(contributionId);
    }

    function revokeContribution(uint256 contributionId) external onlyAdmin {
        Contribution storage c = contributions[contributionId];
        require(c.approved, "Not approved");

        Theme storage t = themes[c.themeId];
        c.approved = false;

        // Remove from allCollaborators
        for (uint256 i = 0; i < t.allCollaborators.length; i++) {
            if (t.allCollaborators[i] == c.creator) {
                t.allCollaborators[i] = t.allCollaborators[t.allCollaborators.length - 1];
                t.allCollaborators.pop();
                t.collaborators--;
                break;
            }
        }

        emit ContributionRevoked(contributionId);
    }

    function tipTheme(uint256 themeId) external payable {
        Theme storage t = themes[themeId];
        require(t.collaborators > 0, "No collaborators to tip");
        require(msg.value > 0, "No ETH sent");

        uint256 share = msg.value / t.allCollaborators.length;

        for (uint256 i = 0; i < t.allCollaborators.length; i++) {
            payable(t.allCollaborators[i]).transfer(share);
            uint256 collaboratorEarnings = collaboratorThemeEarnings[t.allCollaborators[i]][themeId];
            collaboratorThemeEarnings[t.allCollaborators[i]][themeId] =  collaboratorEarnings+share;
        }

        t.tips += msg.value;
        emit TipReceived(themeId, msg.value, share);
    }

    // Getter for collaborators
    function getCollaborators(uint256 themeId) external view returns (address[] memory) {
        return themes[themeId].allCollaborators;
    }

        // Get all themes
    function getAllThemes() external view returns (Theme[] memory) {
        Theme[] memory allThemes = new Theme[](nextThemeId - 1);
        for (uint256 i = 1; i < nextThemeId; i++) {
            allThemes[i - 1] = themes[i];
        }
        return allThemes;
    }

    // Get all contributions
    function getAllContributions() external view returns (Contribution[] memory) {
        Contribution[] memory allContribs = new Contribution[](nextContributionId - 1);
        for (uint256 i = 1; i < nextContributionId; i++) {
            allContribs[i - 1] = contributions[i];
        }
        return allContribs;
    }

    // Get all contributions by a specific user
    function getUserContributions(address user) external view returns (Contribution[] memory) {
        uint256 count = 0;

        // First count how many
        for (uint256 i = 1; i < nextContributionId; i++) {
            if (contributions[i].creator == user) {
                count++;
            }
        }

        Contribution[] memory result = new Contribution[](count);
        uint256 index = 0;

        for (uint256 i = 1; i < nextContributionId; i++) {
            if (contributions[i].creator == user) {
                result[index] = contributions[i];
                index++;
            }
        }

        return result;
    }

    //get user theme total earnings
    function getUserThemeEarnings(address user, uint256 themeId) external view returns (uint256) {
        return collaboratorThemeEarnings[user][themeId];
    }

}
