def calculate_fv(c0: float, r: float, p: float, N: int) -> float:
    """
    Calculate the future value of an investment with an initial capital, annual return, and yearly savings.

    Parameters
    ----------
    c0 : float
        The initial capital (principal) at the start of the investment period.
    r : float
        The annual return rate (as a decimal, e.g., 0.07 for 7%).
    p : float
        The yearly payment (savings or contributions) made at the end of each year.
    N : int
        The number of years the investment will grow.

    Returns
    -------
    float
        The future value of the investment after N years, considering both the initial capital
        and yearly contributions with compounded interest.
    """
    return c0 * (1 + r) ** N + p * (((1 + r) ** N - 1) / r)


def calcualte_w1(c0: float, r: float, i: float, N: int):
  """
  Calculate the initial annual withdrawal amount that grows with inflation, ensuring the capital depletes to zero.

  Parameters
  ----------
  c0 : float
      The initial capital available at the start of withdrawals.
  r : float
      The annual return rate on the remaining capital (as a decimal, e.g., 0.05 for 5%).
  i : float
      The annual inflation rate (as a decimal, e.g., 0.02 for 2%), which affects the withdrawal amount.
  N : int
      The number of years over which withdrawals will be made.

  Returns
  -------
  float
      The initial annual withdrawal amount, which increases with inflation each year,
      ensuring the capital reaches exactly zero at the end of the period.
  """
  return (c0 * (1+r) ** N) / sum([(1+i)**j*(1+r)**(N-j) for j in range(N)])
