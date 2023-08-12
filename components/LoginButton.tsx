
export default function LoginButton() {
    return (
      <form action="/auth/sign-in" method="post">
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          LoginButton
        </button>
      </form>
    )
  }