from dataclasses import dataclass
import pandas as pd


@dataclass
class ClientData:
    age_now: int
    age_retirement: int
    age_death: int
    c0: float
    p: float
    r: float
    i: float
    
    def __init__(self, age_now: int, age_retirement: int, age_death: int, c0: float, p: float, r: float = 0.07, i: float = 0.02):
        self.age_now = age_now
        self.age_retirement = age_retirement
        self.age_death = age_death
        self.c0 = c0
        self.p = p
        self.r = r
        self.i = i


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


def calculate_w1(c0: float, r: float, i: float, N: int):
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


def calculate_monthly_passive_income(c0: float, r: float, i: float, p: float, age_now: int, age_retirement: int, age_death: int) -> int:
    """
    Calculate the estimated monthly passive income after retirement.

    Parameters
    ----------
    c0 : float
        The initial capital.
    r : float
        The annual rate of return (as a decimal).
    i : float
        The annual inflation rate (as a decimal).
    p : float
        The annual contribution to the investment.
    age_now : int
        The current age of the individual.
    age_retirement : int
        The age at which the individual plans to retire.
    age_death : int
        The age at which the individual is expected to pass away.

    Returns
    -------
    int
        The estimated monthly passive income after retirement.
    """
    fv = calculate_fv(c0=c0, r=r, p=p*12, N=age_retirement-age_now)
    w1 = calculate_w1(c0=fv, r=r, i=i, N=age_death-age_retirement)
    w_pp = w1 / (1 + i) ** (age_retirement - age_now)
    return int(w_pp / 12)


def create_acc_table(c0: float, r: float, p: float, age_now: int, age_retirement: int) -> pd.DataFrame:
    """
    Create an accumulation table showing the growth of capital over time.
    
    Parameters
    ----------
    c0 : float
        Initial capital.
    r : float
        Annual return rate (as a decimal).
    p : float
        Monthly savings amount.
    age_now : int
        Current age of the individual.
    age_retirement : int
        Age at which retirement is planned.

    Returns
    -------
    pd.DataFrame
        A DataFrame containing the following columns:
        - age: The individual's age for each year.
        - capital_year_start: Capital at the beginning of the year.
        - interest: Interest earned during the year.
        - saved: Amount saved during the year.
        - capital_year_end: Capital at the end of the year.
    """
    results = []
    capital_prev = c0
    
    for age in range(age_now, age_retirement):
        capital = calculate_fv(c0=c0, r=r, p=p * 12, N=age - age_now + 1)
        results.append({
            "age": age,
            "capital_year_start": int(capital_prev),
            "interest": int(capital_prev * r),
            "saved": int(p * 12),
            "capital_year_end": int(capital)
        })
        capital_prev = capital
    
    return pd.DataFrame(results)


def create_dict_table(c0: float, r: float, i: float, p: float, age_now: int, age_retirement: int,
                      age_death: int) -> pd.DataFrame:
    """
    Create a retirement table showing the withdrawal and capital changes over time.

    Parameters
    ----------
    c0 : float
        Initial capital at the time of retirement.
    r : float
        Annual return rate (as a decimal).
    i : float
        Annual inflation rate (as a decimal).
    p : float
        Annual withdrawal amount (as a monthly value, converted to yearly).
    age_now : int
        Current age of the individual.
    age_retirement : int
        Age at which retirement is planned.
    age_death : int
        Expected age of death.

    Returns
    -------
    pd.DataFrame
        A DataFrame containing the following columns:
        - age: The individual's age for each year from retirement until death.
        - capital_year_start: Capital at the start of each year.
        - saved: Amount withdrawn during the year.
        - interest: Interest earned during the year.
        - capital_year_end: Capital at the end of the year.
    """
    fv = calculate_fv(c0=c0, r=r, p=p * 12, N=age_retirement - age_now)
    w1 = calculate_w1(c0=fv, r=r, i=i, N=age_death - age_retirement)
    
    results = []
    capital_prev = fv
    for age in range(age_retirement, age_death + 1):
        withdrawal = w1 * (1 + i) ** (age - age_retirement - 1)
        capital = (capital_prev - withdrawal) * (1 + r)
        results.append({
            "age": age,
            "capital_year_start": int(capital_prev),
            "saved": -int(withdrawal),
            "interest": int((capital_prev - withdrawal) * r),
            "capital_year_end": int(capital)
        })
        capital_prev = capital

    return pd.DataFrame(results)


def create_capital_lifecycle_table(c0: float, r: float, i: float, p: float, age_now: int, 
                                   age_retirement: int, age_death: int) -> pd.DataFrame:
    """
    Create a table showing both the accumulation phase and the withdrawal phase of capital over time.

    Parameters
    ----------
    c0 : float
        Initial capital.
    r : float
        Annual return rate (as a decimal).
    i : float
        Annual inflation rate (as a decimal).
    p : float
        Annual savings or withdrawal amount (as a monthly value, converted to yearly).
    age_now : int
        Current age of the individual.
    age_retirement : int
        Age at which retirement is planned.
    age_death : int
        Expected age of death.

    Returns
    -------
    pd.DataFrame
        A DataFrame combining the accumulation table (before retirement) and the distribution table 
        (after retirement) with the following columns:
        - age: The individual's age for each year.
        - capital_year_start: Capital at the beginning of the year.
        - interest: Interest earned during the year.
        - saved: Amount saved or withdrawn during the year.
        - capital_year_end: Capital at the end of the year.
    """
    acc_table = create_acc_table(c0, r, p, age_now, age_retirement)
    dist_table = create_dict_table(c0, r, i, p, age_now, age_retirement, age_death)
    
    return pd.concat([acc_table, dist_table])
