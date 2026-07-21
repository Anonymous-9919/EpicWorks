"use server";

import { Octokit } from "@octokit/rest";

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BRANCH = "main";

function getOctokit() {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  return new Octokit({ auth: GITHUB_TOKEN });
}

export async function uploadImageToRepo(
  fileName: string,
  base64Content: string,
  mimeType: string
): Promise<{ path: string; url: string }> {
  const octokit = getOctokit();
  const remotePath = `public/images/${fileName}`;

  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER!,
      repo: GITHUB_REPO!,
      path: remotePath,
      ref: BRANCH,
    });
    if ("sha" in data) sha = data.sha;
  } catch {
    // File doesn't exist yet, that's fine
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    path: remotePath,
    message: `Upload ${fileName}`,
    content: base64Content,
    sha,
    branch: BRANCH,
  });

  return {
    path: remotePath,
    url: `/${remotePath.replace(/^public\//, "")}`,
  };
}

export async function deleteImageFromRepo(remotePath: string): Promise<void> {
  const octokit = getOctokit();

  const { data } = await octokit.repos.getContent({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    path: remotePath,
    ref: BRANCH,
  });

  if (!("sha" in data)) throw new Error("File not found");

  await octokit.repos.deleteFile({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    path: remotePath,
    message: `Delete ${remotePath.split("/").pop()}`,
    sha: data.sha,
    branch: BRANCH,
  });
}

export async function getRepoSettings() {
  return {
    configured: Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO),
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  };
}
